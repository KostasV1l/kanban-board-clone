import { SquareKanban } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <SquareKanban className="inline w-fit text-primary" />
            <span className="ms-2 font-primary font-extrabold uppercase">TaskFlow</span>
        </div>
    );
};
