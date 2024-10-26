export type TransactionType = "Deposit" | "Expense" | "Pay friend";

export type TransactionCategoryId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TransactionItem = {
    transaction_id?: string,
    title: string,
    transaction_type: TransactionType,
    category_id: TransactionCategoryId | null,
    payer_currency: string | null,
    recipient_currency: string | null,
    exchange_rate: number | null,
    amount: number,
    payer_id: string | null,
    recipient_id: string | null,
    budget_id: string | null,
    payer_data: {
        username?: string,
        first_name?: string | null,
        last_name?: string | null,
        avatar_url?: string | null,
    } | null,
    recipient_data: {
        username?: string,
        first_name?: string | null,
        last_name?: string | null,
        avatar_url?: string | null,
    } | null,
    budget_data: {
        name?: string,
        category_id?: TransactionCategoryId,
    } | null,
    description: string | null,
    created_at: string | null,
};