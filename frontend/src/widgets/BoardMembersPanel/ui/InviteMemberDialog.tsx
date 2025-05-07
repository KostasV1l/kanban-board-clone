import { Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInviteUserByEmail } from "@/entities/member/hooks";
import { MEMBER_ROLES, ROLE_LABELS } from "@/entities/member/model/role";
import { getRoleColor } from "@shared/utils/color-helpers";

interface InviteMemberDialogProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const InviteMemberDialog = ({ boardId, isOpen, onClose }: InviteMemberDialogProps) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<string>(MEMBER_ROLES.VIEWER);

    const { mutate: inviteUser, isPending } = useInviteUserByEmail();

    const handleRoleChange = (value: string) => {
        setRole(value as | "EDITOR" | "VIEWER");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = { boardId, email, role };

        inviteUser(data, {
            onSuccess: () => {
                setEmail("");
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>Invite a user to collaborate on this board.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-3">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <RadioGroup value={role} onValueChange={handleRoleChange} className="space-y-1" disabled={isPending}>
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                <RadioGroupItem value={MEMBER_ROLES.VIEWER} id="invite-role-viewer" />
                                <Label
                                    htmlFor="invite-role-viewer"
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
                            <div className="flex items-center space-x-2 rounded-md border p-3">
                                <RadioGroupItem value={MEMBER_ROLES.EDITOR} id="invite-role-editor" />
                                <Label
                                    htmlFor="invite-role-editor"
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
                        </RadioGroup>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!email.trim() || isPending}>
                            {isPending ? "Inviting..." : "Invite"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
