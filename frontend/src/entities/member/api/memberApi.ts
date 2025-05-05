import axiosInstance from "@shared/api/axios-instance";
import { IMember } from "../model";
export const MemberAPI = {
    getMembers: async (boardId: string) => {
        const { data } = await axiosInstance.get<IMember[]>(`/boards/${boardId}/members`);
        return data;
    }
}
