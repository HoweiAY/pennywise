import { TransactionCategoryId, TransactionType } from "@/lib/types/transactions";
import { BudgetCategoryId } from "@/lib/types/budget";

export type AuthFormState = {
    error?: {
        username?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export type AccountSetupFormData = {
    first_name?: string,
    last_name?: string,
    country?: string,
    currency?: string,
    balance?: number,
    spending_limit?: number | null,
    avatar_url?: string | null,
};

export type UserProfileFormState = {
    error?: {
        username?: string[] | undefined;
        email?: string[] | undefined;
        firstName?: string[] | undefined;
        lastName?: string[] | undefined;
        country?: string[] | undefined;
        spendingLimit?: string[] | undefined;
        avatarUrl?: string[] | undefined;
    };
    message?: string | null;
};

export type UserProfileFormData = {
    username: string,
    email: string,
    first_name?: string | null,
    last_name?: string | null,
    country: string,
    spending_limit?: number | null,
    avatar_url?: string | null,
    updated_at?: string,
};

export type TransactionFormState = {
    error?: {
        title?: string[] | undefined;
        currency?: string[] | undefined;
        amount?: string[] | undefined;
        balance?: string[] | undefined;
        remainingSpendingLimit?: string[] | undefined;
        type?: string[] | undefined;
        budget?: string[] | undefined;
        remainingBudgetAmount?: string[] | undefined;
        category?: string[] | undefined;
        description?: string[] | undefined;
    };
    message?: string | null;
};

export type TransactionFormData = {
    transaction_id?: string,
    title: string,
    transaction_type: TransactionType,
    category_id?: TransactionCategoryId | null,
    payer_currency?: string | null,
    recipient_currency?: string | null,
    exchange_rate?: number | null,
    amount: number,
    payer_id?: string | null,
    recipient_id?: string | null,
    budget_id?: string | null,
    description: string | null,
    updated_at?: string,
    created_at?: string,
};

export type BudgetFormState = {
    error?:{
        name?: string[] | undefined;
        amount?: string[] | undefined;
        category?: string[] | undefined;
        description?: string[] | undefined;
    };
    message?: string | null;
};

export type BudgetFormData = {
    budget_id?: string,
    name: string,
    category_id: BudgetCategoryId,
    currency: string,
    amount: number,
    user_id: string,
    description: string | null,
    updated_at?: string | null,
};

export type FriendFormState = {
    message?: string | null,
};