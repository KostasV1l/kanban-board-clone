import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleApiError(error: unknown, context?: string): string {
    const message = error instanceof AxiosError && error.response?.data?.message
      ? error.response.data.message
      : "An unexpected error occurred. Please try again.";
      
    toast.error(message);
    console.error(context || "API request failed:", error);
    
    return message; 
  }