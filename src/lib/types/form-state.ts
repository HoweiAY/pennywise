import { TransactionType } from "@/lib/types/transactions";

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

export type TransactionFormState = {
    error?: {
        title?: string[] | undefined;
        currency?: string[] | undefined;
        amount?: string[] | undefined;
        type?: string[] | undefined;
        budget?: string[] | undefined;
        category?: string[] | undefined;
        description?: string[] | undefined;
    };
    message?: string | null;
}

export type TransactionFormData = {
    title: string,
    transaction_type: TransactionType,
    category_id: number | null,
    payer_currency?: string | null,
    recipient_currency?: string | null,
    exchange_rate?: number | null,
    amount: number,
    payer_id?: string | null,
    recipient_id?: string | null,
    budget_id?: string | null,
    description: string | null,
}