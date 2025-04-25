import { LoginFormData } from "@/features/auth/login-form/model";

//=========================
// User login request
//=========================
export const loginUser = async (data: LoginFormData): Promise<Response> => {
    try {
        // TODO: Check actual API endpoint
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
// User registration request
//=========================
export const registerUser = async (data: { username: string; email: string; password: string }): Promise<Response> => {
    try {
        // TODO: Check actual API endpoint
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        // Auto-login after successful registration
        if (res.ok) {
            // Store the token
            const data = await res.json();
            if (data.token) {
                setAuthToken(data.token);
            }
        }

        return res;
    } catch (error) {
        console.error("Registration request failed:", error);
        throw error;
    }
};

// ? Should we keep JWT token in local storage, use cookies or use SessionStorage?
// LocalStorage
//=========================
// Fetch JWT from local storage
//=========================
export const getAuthToken = (): string | null => {
    return localStorage.getItem("jwt");
};

//=========================
// Set JWT in local storage
//=========================
export const setAuthToken = (token: string): void => {
    localStorage.setItem("jwt", token);
};

//=========================
// Remove JWT from local storage
//=========================
export const removeAuthToken = (): void => {
    localStorage.removeItem("jwt");
};

// SessionStorage

// //=========================
// // Fetch JWT from SessionStorage
// //=========================
// export const getSessionAuthToken = (): string | null => {
//     return sessionStorage.getItem("jwt");
// };

// //=========================
// // Set JWT in SessionStorage
// //=========================
// export const setSessionAuthToken = (token: string): void => {
//     sessionStorage.setItem("jwt", token);
// };

// //=========================
// // Remove JWT from SessionStorage
// //=========================
// export const removeSessionAuthToken = (): void => {
//     sessionStorage.removeItem("jwt");
// };
