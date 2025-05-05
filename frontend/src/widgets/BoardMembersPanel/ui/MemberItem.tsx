import { IMember } from "@/entities/member/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleColor } from "@shared/utils/color-helpers";

interface MemberItemProps {
  member: IMember;
}


export const MemberItem = ({ member }: MemberItemProps) => {
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent/50">
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
  );
}; 