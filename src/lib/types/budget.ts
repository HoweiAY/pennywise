export type BudgetCategoryId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BudgetItem = {
    budget_id?: string,
    name: string,
    category_id: BudgetCategoryId,
    currency: string,
    amount: number,
    user_id: string,
    description: string | null,
    updated_at?: string | null,
};