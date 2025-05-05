import { BaseEntity } from "@shared/model/BaseEntity";

export interface User {
    id: string;
    username: string;
    email: string;
}


export interface IMember extends BaseEntity {
    user: User;
    boardId: string;
    role: string;
}
