import { useState } from "react";
import { IMember } from "@/entities/member/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleColor } from "@shared/utils/color-helpers";
import { DeleteMemberDialog } from "./DeleteMemberDialog";
import { MemberActionsDialog } from "./MemberActionsDialog";  

interface MemberItemProps {
  member: IMember;
  boardId: string;
  isCurrentUser?: boolean; 
  isOwner?: boolean; 
  onMemberSelect?: () => void;
}

export const MemberItem = ({ member, boardId, isCurrentUser = false, isOwner = false, onMemberSelect }: MemberItemProps) => {
  const [showActionsDialog, setShowActionsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const canManageMember = isOwner && !isCurrentUser;

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleRowClick = () => {
    if (canManageMember) {
      setShowActionsDialog(true);
    }
  };
  
  const handleDeleteAction = () => {
    setShowActionsDialog(false);
    setShowDeleteDialog(true);
  };
  
  const handleActionsClose = () => {
    setShowActionsDialog(false);
    if (onMemberSelect) {
      onMemberSelect();
    }
  };
  
  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    if (onMemberSelect) {
      onMemberSelect();
    }
  };

  return (
    <>
      <div 
        className={`flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/50 ${canManageMember ? 'cursor-pointer' : ''}`}
        onClick={handleRowClick}
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.user?.username ? `https://avatar.vercel.sh/${member.user.username}` : undefined} />
            <AvatarFallback>{getInitials(member.user?.username || '')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{member.user?.username}</p>
            <p className="text-xs text-muted-foreground">{member.user?.email}</p>
          </div>
        </div>
        
        <Badge variant="secondary" className={`${getRoleColor(member.role)} text-white text-xs`}>
          {member.role}
        </Badge>
      </div>

      {showActionsDialog && (
        <MemberActionsDialog
          member={member}
          boardId={boardId}
          isOpen={showActionsDialog}
          onClose={handleActionsClose}
          onDelete={handleDeleteAction}
        />
      )}

      {showDeleteDialog && (
        <DeleteMemberDialog
          member={member}
          boardId={boardId}
          isOpen={showDeleteDialog}
          onClose={handleDeleteDialogClose}
        />
      )}
    </>
  );
}; 