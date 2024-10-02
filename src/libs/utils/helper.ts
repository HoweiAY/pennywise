import { AuthFormState } from "@/libs/types/form-state";

export function authErrorMessage(error: AuthFormState | undefined): string {
    let errorMessage = "An error has occurred";
    if (error) {
        if (error.error) {
            const { username, email, password } = error.error;
            if (username) return username[0];
            if (email) return email[0];
            if (password) return password[0];
        }
        if (error.message) errorMessage = error.message;
    }
    return errorMessage;
}
