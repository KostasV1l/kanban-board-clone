import { SquareKanban } from "lucide-react";

export const Logo = () => {
    return (
        <div className="flex justify-center items-center">
            <SquareKanban size={30} className="w-fit text-primary" />
            <span className="ms-2 text-2xl font-primary font-extrabold uppercase">TaskFlow</span>
        </div>
    );
};
