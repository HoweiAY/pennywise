export type TransactionType = "Deposit" | "Expense" | "Pay friend";

export type TransactionCategoryId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TransactionItem = {
    transaction_id: string;
    title: string;
    payer_currency: string | null;
    recipient_currency: string | null;
    exchange_rate: number;
    amount: number;
    transaction_type: TransactionType;
    category_id: TransactionCategoryId | null;
    payer_data: {
        avatar_url: string;
    }[];
    recipient_data: {
        avatar_url: string;
    }[];
    description: any;
    created_at: any;
};