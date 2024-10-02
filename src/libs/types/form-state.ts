export type AuthFormState = {
    error?: {
        username?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
}