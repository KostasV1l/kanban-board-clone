import { LoginFormData } from "@/features/auth/login-form/model";

//=========================
// User login request
//=========================
export const loginUser = async (data: LoginFormData): Promise<Response> => {
    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return res;
    } catch (error) {
        console.error("Login request failed:", error);
        throw new Error("Login request failed");
    }
};

//=========================
// Fetch JWT auth token from local storage
//=========================
export const getAuthToken = (): string | null => {
    return localStorage.getItem("jwt");
};

//=========================
// Set JWT auth token in local storage
//=========================
export const setAuthToken = (token: string): void => {
    localStorage.setItem("jwt", token);
};

//=========================
// Remove JWT auth token from local storage
//=========================
export const removeAuthToken = (): void => {
    localStorage.removeItem("jwt");
};
