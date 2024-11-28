export type TransactionChartData = {
    month: string,
    deposit: number,
    expense: number,
}[];

export type ExpenseBreakdownChartData = {
    category: string,
    amount: number,
    fill: string,
}[];

export type ExpenseBudgetComparisonChartData = {
    month: string,
    expenseAmount: number,
    spentBudgetAmount: number,
}[];

export type BudgetAllocationChartData = {
    category: string,
    amount: number,
    fill: string,
}[];