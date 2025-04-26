export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
    };
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
}
