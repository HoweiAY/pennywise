import { DataResponse } from "@/lib/types/data";
import { UserData, UserBalanceData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getFilteredUsers(
    search?: string,
    itemsLimit?: number,
    offset?: number,
    excludeCurrentUser?: boolean,
): Promise<DataResponse<UserData[]>> {
    noStore();

    itemsLimit ??= 10;
    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("users")
        .select("username, email, first_name, last_name, country, avatar_url");
    if (search) {
        supabaseQuery = supabaseQuery.ilike("username", `%${search}%`);
    }
    if (offset) {
        supabaseQuery = supabaseQuery.range(offset, offset + itemsLimit - 1);
    }
    if (excludeCurrentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            supabaseQuery = supabaseQuery.not("user_id", "eq", user.id);
        }
    }
    supabaseQuery = supabaseQuery
        .order("username")
        .limit(itemsLimit);
    const { data: usersData, error } = await supabaseQuery;
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { usersData: usersData satisfies UserData[] ?? [] },
    };
}

export async function getUserDataByUsername(username: string): Promise<DataResponse<UserData>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: userData, error } = await supabase
        .from("users")
        .select("user_id, username, email, first_name, last_name, country, avatar_url")
        .eq("username", username)
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