"use server";

import { ServerActionResponse } from "@/lib/types/action";
import { UserBalanceData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

// Server action for fetching users' account balance information
export async function getUserBalanceData(userId: string): Promise<ServerActionResponse<UserBalanceData>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: userBalanceData, error } = await supabase
        .from("users")
        .select("currency, balance, spending_limit")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return {
            status: "error",
            code: 500,
            message: error.message,
        }
    }
    return {
        status: "success",
        code: 200,
        data: { userBalanceData: userBalanceData[0] as UserBalanceData },
    };
}

// Server action for getting a user's currency
export async function getUserCurrency(userId: string): Promise<ServerActionResponse<string>> {
    noStore();
    
    const supabase = await createSupabaseServerClient();
    const { data: userCurrencyData, error } = await supabase
        .from("users")
        .select("currency")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return {
            status: "error",
            code: 500,
            message: error.message,
        };
    }
    return {
        status: "success",
        code: 200,
        data: { userCurrency: userCurrencyData[0].currency as string },
    };
}

// Server action for increasing users' balance amount
export async function addUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<ServerActionResponse<void>> {
    try {
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
        return { status: "success", code: 204 };
    } catch (error) {
        let message = "Failed to add user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            code: 500,
            message,
        };
    }
}

// Server action for deducting users' balance by a given amount
export async function deductUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<ServerActionResponse<void>> {
    try {
        const supabase = supabaseClient ?? await createSupabaseServerClient();
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("balance")
            .eq("user_id", userId)
            .limit(1);
        if (userError) throw userError;
        let { balance: balanceInCents }: { balance: number } = userData[0];
        if (balanceInCents < amountInCents) {
            return {
                status: "fail",
                code: 400,
                message: "Deduction amount exceeds account balance",
            };
        }
        balanceInCents -= amountInCents;
        const { error: updateError } = await supabase
            .from("users")
            .update({ balance: balanceInCents })
            .eq("user_id", userId);
        if (updateError) throw updateError;
        return { status: "success", code: 204 };
    } catch (error) {
        let message = "Failed to deduct user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            code: 500,
            message,
        };
    }
}