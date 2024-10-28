import { DataResponse } from "@/lib/types/data";
import { UserData, UserBalanceData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserDataById(userId: string): Promise<DataResponse<UserData>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: userData, error } = await supabase
        .from("users")
        .select("username, email, first_name, last_name, country, avatar_url")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { userData: userData[0] satisfies UserData },
    };
}

export async function getUserBalanceData(userId: string): Promise<DataResponse<UserBalanceData>> {
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
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { userBalanceData: userBalanceData[0] satisfies UserBalanceData },
    };
}

export async function getUserCurrency(userId: string): Promise<DataResponse<string>> {
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
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { userCurrency: userCurrencyData[0].currency as string },
    };
}