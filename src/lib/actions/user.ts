"use server";

import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

// Server action for fetching users' account balance information
export async function getUserBalanceData(userId: string): Promise<{
    userBalanceData?: {
        currency: string,
        balance: number,
        spending_limit: number | null,
    },
    errorMessage?: string,
}> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: userBalanceData, error } = await supabase
        .from("users")
        .select("currency, balance, spending_limit")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return { errorMessage: error.message }
    }
    return { userBalanceData: userBalanceData[0] };
}

// Server action for getting a user's currency
export async function getUserCurrency(userId: string): Promise<{
    userCurrencyData?: string,
    errorMessage?: string,
}> {
    noStore();
    
    const supabase = await createSupabaseServerClient();
    const { data: userCurrencyData, error } = await supabase
        .from("users")
        .select("currency")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return { errorMessage: error.message };
    }
    return { userCurrencyData: userCurrencyData[0].currency };
}

// Server action for increasing users' balance amount
export async function addUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<void> {
    const supabase = supabaseClient ?? await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("balance")
        .eq("user_id", userId)
        .limit(1);
    if (userError) throw userError;
    let { balance: balanceInCents }: { balance: number } = userData[0];
    balanceInCents += amountInCents;
    const { error: updateError } = await supabase
        .from("users")
        .update({ balance: balanceInCents })
        .eq("user_id", userId);
    if (updateError) throw updateError;
}

// Server action for deducting users' balance by a given amount
export async function deductUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<void> {
    const supabase = supabaseClient ?? await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("balance")
        .eq("user_id", userId)
        .limit(1);
    if (userError) throw userError;
    let { balance: balanceInCents }: { balance: number } = userData[0];
    if (balanceInCents < amountInCents) {
        throw new Error("Deduction amount exceeds account balance");
    }
    balanceInCents -= amountInCents;
    const { error: updateError } = await supabase
        .from("users")
        .update({ balance: balanceInCents })
        .eq("user_id", userId);
    if (updateError) throw updateError;
}