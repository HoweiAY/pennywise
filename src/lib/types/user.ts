export type UserData = {
    user_id?: string,
    username: string,
    email: string,
    first_name?: string | null,
    last_name?: string | null,
    country?: string | null,
    avatar_url?: string | null,
}

export type UserBalanceData = {
    currency: string,
    balance: number,
    spending_limit: number | null,
};