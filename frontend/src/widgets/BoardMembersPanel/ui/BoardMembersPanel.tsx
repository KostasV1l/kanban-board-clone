import { useState } from "react";
import { useGetMembers } from "@/entities/member/hooks";
import { MemberItem } from "@widgets/BoardMembersPanel/ui/MemberItem";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { useAuthStatus } from "@/features/auth/hooks";

interface BoardMembersPanelProps {
  boardId: string;
}

export const BoardMembersPanel = ({ boardId }: BoardMembersPanelProps) => {
  const { data: members = [], isLoading, error } = useGetMembers(boardId);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { user } = useAuthStatus();
  
  const currentUserMembership = members.find(member => member.user?.id === user?.id);
  const isOwner = currentUserMembership?.role === "OWNER";
  
  if (isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Users className="size-4" /> Loading members...</div>;
  }
  
  if (error) {
    return <div className="text-destructive">Error loading members</div>;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Users className="size-4" />
            <span className="hidden md:inline">Members</span>
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
              {members.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Board Members</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="size-3.5 mr-1" />
                Invite
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No members found
                </p>
              ) : (
                members.map((member) => (
                  <MemberItem 
                    key={member.id} 
                    member={member} 
                    boardId={boardId}
                    isCurrentUser={member.user?.id === user?.id}
                    isOwner={isOwner}
                  />
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <InviteMemberDialog 
        boardId={boardId}
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
      />
    </>
  );
}; 