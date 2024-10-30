import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { BudgetFormData } from "@/lib/types/form-state";
import { BudgetCategoryId, BudgetItem } from "@/lib/types/budget";
import { TransactionCategoryId } from "@/lib/types/transactions";
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
        data: { userBudgetData: userBudgetData satisfies BudgetFormData[] },
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

export async function getBudgetAmountSpentByCategory(
    userId: string,
    categoryId: TransactionCategoryId | BudgetCategoryId,
    from?: Date,
    to?: Date,
): Promise<DataResponse<number>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("transactions")
        .select("spentBudget:amount.sum(), budgets!inner(category_id)")
        .eq("payer_id", userId)
        .eq("budgets.category_id", categoryId);
    if (from) {
        supabaseQuery = supabaseQuery.gte("created_at", from.toISOString());
    }
    if (to) {
        supabaseQuery = supabaseQuery.lt("created_at", to.toISOString());
    }
    const { data: spentBudgetData, error } = await supabaseQuery;
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { spentBudget: spentBudgetData.length > 0 ? spentBudgetData[0].spentBudget as number : 0 },
    };
}