"use server";

import { ServerActionResponse } from "@/lib/types/action";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

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
        return { status: "success" };
    } catch (error) {
        let message = "Failed to add user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
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
                message: "Deduction amount exceeds account balance",
            };
        }
        balanceInCents -= amountInCents;
        const { error: updateError } = await supabase
            .from("users")
            .update({ balance: balanceInCents })
            .eq("user_id", userId);
        if (updateError) throw updateError;
        return { status: "success" };
    } catch (error) {
        let message = "Failed to deduct user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            message,
        };
    }
}