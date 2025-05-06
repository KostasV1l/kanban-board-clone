import { UserMinus, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IMember } from "@/entities/member/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleColor } from "@shared/utils/color-helpers";

interface MemberActionsDialogProps {
    member: IMember;
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export const MemberActionsDialog = ({ member, isOpen, onClose, onDelete }: MemberActionsDialogProps) => {
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Member Actions</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center p-3 bg-background border rounded-lg mb-6">
                        <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage src={member.user?.username ? `https://avatar.vercel.sh/${member.user.username}` : undefined} />
                            <AvatarFallback>{getInitials(member.user?.username || '')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium">{member.user?.username}</p>
                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                        </div>
                        <Badge variant="secondary" className={`${getRoleColor(member.role)} text-white`}>
                            {member.role}
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full justify-between items-center p-6 bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all duration-200 group"
                        >
                            <div className="flex items-center">
                                <div className="bg-primary/10 text-primary rounded-full p-2 mr-3">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium">Change Role</p>
                                    <p className="text-xs text-muted-foreground">Update member permissions</p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                        </Button>

                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full justify-between items-center p-6 bg-destructive/5 hover:bg-destructive/10 border-destructive/20 text-destructive transition-all duration-200 group"
                            onClick={onDelete}
                        >
                            <div className="flex items-center">
                                <div className="bg-destructive/10 text-destructive rounded-full p-2 mr-3">
                                    <UserMinus className="h-5 w-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="font-medium">Remove Member</p>
                                    <p className="text-xs text-muted-foreground">Revoke access to this board</p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-destructive opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 