"use client";

import { useParams } from "next/navigation";
import { useGetLists } from "@entities/list/hooks";
import { List } from "@entities/list/model";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { NewListColumn } from "@widgets/DashboardPage/new-column";

export const dynamic = "force-dynamic";

const BoardPage = () => {
    const { id } = useParams() as { id: string };

    const { data: dataLists = [], isLoading, error } = useGetLists(id);

    if (isLoading) {
        return <div>Loading....</div>;
    }

    if (error) {
        return <div>Error.....</div>;
    }

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
                {dataLists.map((list: List) => (
                    <ListColumn key={list.id} list={list} />
                ))}
                <NewListColumn currentLength={dataLists.length} boardId={id} />
            </div>
        </div>
    );
};

export default BoardPage;
