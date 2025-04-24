import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Logo } from "./logo";

export const Header = () => {
    return (
        <header className="w-full bg-accent flex justify-between items-center p-4">
            <Link href="/">
                <Logo />
            </Link>
            <Avatar className="cursor-pointer rounded-xl border border-primary">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </header>
    );
};

export default Header;
