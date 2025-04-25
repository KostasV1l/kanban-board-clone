"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

export const BoardPage = () => {
    const { id } = useParams() as { id: string };
    useEffect(() => {
        // This is a placeholder for any side effects you want to run when the component mounts
        console.log("Board ID:", id);
    }, [id]);

    return (
        <div>
            <h1>Board Page</h1>
            <p>Board ID: {id}</p>
        </div>
    );
};

export default BoardPage;
