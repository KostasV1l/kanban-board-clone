import { CheckCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function RegisterSuccessAlert() {
  return (
    <Alert className="bg-green-50 border-green-200 mb-4">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle className="text-green-600">Success</AlertTitle>
      <AlertDescription className="text-green-600">
        Your account has been successfully created! You will be redirected to the dashboard.
      </AlertDescription>
    </Alert>
  )
} 