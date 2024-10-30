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