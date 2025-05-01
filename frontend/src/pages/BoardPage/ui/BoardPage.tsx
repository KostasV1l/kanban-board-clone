"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { List } from "@entities/list/model";
import { ListColumn } from "@widgets/DashboardPage/list-column";
import { useGetLists } from "@entities/list/hooks";

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
            <h1>Board Page</h1>
            <p>Board ID: {id}</p>

            <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
                {dataLists.length === 0 ? (
                    <p>No lists yet</p>
                ) : (
                    dataLists.map((list: List) => <ListColumn key={list.id} list={list} />)
                )}
            </div>
        </div>
    );
};

export default BoardPage;
