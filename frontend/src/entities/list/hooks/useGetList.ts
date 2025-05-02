import { useQuery } from "@tanstack/react-query";
import { ListAPI, listKeys } from "../model";

// Get a single list by ID
export const useGetList = (id: number) => {

    return useQuery({
        queryKey: listKeys.list(id),
        queryFn: () => ListAPI.getList(id),
        enabled: !!id,
    });
};