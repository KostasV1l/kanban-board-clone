import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IMember } from "@/entities/member/model";
import { useDeleteMember } from "@/entities/member/hooks";
import { AxiosError } from "axios";

interface DeleteMemberDialogProps {
    boardId: string;
    member: IMember;
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteMemberDialog = ({ boardId, member, isOpen, onClose }: DeleteMemberDialogProps) => {
    const { mutate: deleteMember, isPending, error: mutationError } = useDeleteMember();

    const handleDelete = () => {

        const data = {
            boardId,
            memberId: member.user.id,
        }


        deleteMember(data,
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Remove Member</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove {member.user?.username || member.user?.email} from this board?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    <p className="text-sm text-muted-foreground mb-4">
                        This action cannot be undone. The member will lose access to this board immediately.
                    </p>

                    {mutationError && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {mutationError instanceof AxiosError && mutationError.response?.data?.message 
                                    ? mutationError.response.data.message 
                                    : "Failed to remove member. Please try again."}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Removing..." : "Remove Member"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}; 