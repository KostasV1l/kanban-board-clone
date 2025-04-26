export interface User {
    id: string;
    username: string;
    email: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    csrfToken?: string;
    user?: User;
    message?: string;
  }
  
  export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
  }