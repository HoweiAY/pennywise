import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { BudgetFormData } from "@/lib/types/form-state";
import { BudgetItem } from "@/lib/types/budget";
import { DataResponse } from "@/lib/types/data";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserBudgets(userId: string): Promise<DataResponse<BudgetFormData[]>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: userBudgetData, error } = await supabase
        .from("budgets")
        .select("budget_id, name, category_id, currency, amount, user_id, description")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(12);
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { userBudgetData: userBudgetData as BudgetFormData[] },
    };
}

export async function getUserBudgetById(
    budgetId: string,
    asForm?: boolean,
): Promise<DataResponse<BudgetItem | BudgetFormData>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: budgetData, error } = await supabase
        .from("budgets")
        .select("name, category_id, currency, amount, user_id, description")
        .eq("budget_id", budgetId)
        .limit(1);
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: budgetData.length > 0
            ? {
                budgetData: asForm
                    ? budgetData[0] as BudgetFormData
                    : budgetData[0] as BudgetItem
            }
            : null,
     };
}

export async function getBudgetAmountSpent(
    budgetId: string,
    from: Date,
    to: Date,
): Promise<DataResponse<number>> {
    noStore();
    
    const supabase = await createSupabaseServerClient();
    const { data: spentBudgetData, error } = await supabase
        .from("transactions")
        .select("spentBudget:amount.sum()")
        .eq("budget_id", budgetId)
        .lt("created_at", to.toISOString())
        .gte("created_at", from.toISOString());
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { spentBudget: spentBudgetData[0].spentBudget as number },
    };
}