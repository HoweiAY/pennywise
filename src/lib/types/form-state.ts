export type AuthFormState = {
    error?: {
        username?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
}

export type AccountSetupFormData = {
    first_name?: string,
    last_name?: string,
    country?: string,
    currency?: string,
    balance?: number,
    spending_limit?: number | null,
    avatar_url?: string | null,
}