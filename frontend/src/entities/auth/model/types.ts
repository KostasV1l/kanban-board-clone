export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
    };
}

export interface RegisterFormData {
    email: string;
    password: string;
}
