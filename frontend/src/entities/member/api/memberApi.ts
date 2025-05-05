import axiosInstance from "@shared/api/axios-instance";
import { IMember } from "../model";
export const MemberAPI = {
    getMembers: async (boardId: string) => {
        const { data } = await axiosInstance.get<IMember[]>(`/boards/${boardId}/members`);
        return data;
    },
    inviteUserByEmail: async (boardId: string, data: { email: string, role: string }) => {
        const { data: response } = await axiosInstance.post<IMember>(`/boards/${boardId}/members`, data);
        return response;
    },
    deleteMember: async (boardId: string, memberId: string) => {
        const { data: response } = await axiosInstance.delete<IMember>(`/boards/${boardId}/members/${memberId}`);
        return response;
    }
}
