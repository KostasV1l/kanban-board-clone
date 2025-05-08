import { useState } from "react";
import { Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IMember } from "@/entities/member/model";
import { useUpdateMemberRole } from "@/entities/member/hooks";
import { MEMBER_ROLES, ROLE_LABELS } from "@/entities/member/model/role";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getRoleColor } from "@shared/utils/color-helpers";

interface ChangeMemberRoleDialogProps {
    member: IMember;
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ChangeMemberRoleDialog = ({ member, boardId, isOpen, onClose }: ChangeMemberRoleDialogProps) => {
    const [selectedRole, setSelectedRole] = useState(member.role);
    const { mutate: updateRole, isPending } = useUpdateMemberRole();

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    };

    const handleSubmit = () => {
        if (selectedRole === member.role) {
            onClose();
            return;
        }

        updateRole(
            {
                boardId,
                memberId: member.user.id,
                role: selectedRole,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Change Member Role</DialogTitle>
                    <DialogDescription>
                        Update permissions for {member.user?.username || member.user?.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="space-y-4">
                        <RadioGroup value={selectedRole} onValueChange={handleRoleChange}>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                <RadioGroupItem value={MEMBER_ROLES.EDITOR} id="role-editor" />
                                <Label 
                                    htmlFor="role-editor"
                                    className="flex-1 flex items-center gap-2 cursor-pointer"
                                >
                                    <div className={`${getRoleColor(MEMBER_ROLES.EDITOR)} text-white p-1 rounded-md`}>
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{ROLE_LABELS[MEMBER_ROLES.EDITOR]}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Can edit lists and tasks, but cannot manage members
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                <RadioGroupItem value={MEMBER_ROLES.VIEWER} id="role-viewer" />
                                <Label 
                                    htmlFor="role-viewer"
                                    className="flex-1 flex items-center gap-2 cursor-pointer"
                                >
                                    <div className={`${getRoleColor(MEMBER_ROLES.VIEWER)} text-white p-1 rounded-md`}>
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{ROLE_LABELS[MEMBER_ROLES.VIEWER]}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Can only view the board, no editing permissions
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isPending || selectedRole === member.role}>
                            {isPending ? "Updating..." : "Update Role"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 