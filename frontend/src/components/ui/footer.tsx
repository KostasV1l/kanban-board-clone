import { Copyright } from "lucide-react";
import { ModeToggle } from "../dark-mode/mode-toggle";


export const Footer = () => {
    return (
        <footer className="w-full relative mt-auto py-4">
            <p className="mx-auto px-4 py-1 mb-2 rounded-full bg-muted w-fit text-xs flex items-center justify-center gap-x-2 text-muted-foreground">
                <Copyright className="inline size-3" /> 2023 TASKFLOW. All rights reserved.
            </p>
            <div className="absolute bottom-4 right-4">
                <ModeToggle />
            </div>
        </footer>
    );
};