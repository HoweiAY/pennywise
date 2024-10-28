"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { BudgetFormState, BudgetFormData } from "@/lib/types/form-state";
import { BudgetCategoryId } from "@/lib/types/budget";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BudgetSchema = z.object({
    name: z.string().trim().min(1, { message: "Please give your budget a name" }),
    currency: z.string(),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than 0" }),
    category: z.coerce.number().gt(0, { message: "Please select a category" }),
    description: z.string().trim().nullable(),
});
const BudgetCategorySchema = z.custom<BudgetCategoryId>();

export async function createBudget(
    prevState: BudgetFormState | undefined,
    formData: FormData,
): Promise<BudgetFormState | undefined> {
    try {
        const name = formData.get("name");
        const currency = formData.get("currency");
        const amount = formData.get("amount");
        const category = formData.get("category");
        const description = formData.get("description");

        const validatedBudgetData = BudgetSchema.safeParse({
            name,
            currency,
            amount,
            category,
            description,
        });
        if (!validatedBudgetData.success) {
            return {
                error: validatedBudgetData.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            }
        }

        const validatedBudgetCategory = BudgetCategorySchema.safeParse(validatedBudgetData.data.category);
        if (!validatedBudgetCategory.success) {
            return { message: "Please select a category for this budget" };
        }
        const categoryId = validatedBudgetCategory.data;

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        const { data: budgetCountData, error: budgetCountError } = await supabase
            .from("budgets")
            .select("budgetCount:count()")
            .eq("user_id", user.id)
            .limit(1);
        if (budgetCountError) throw budgetCountError;
        if (budgetCountData) {
            const { budgetCount } = budgetCountData[0] as { budgetCount: number };
            if (budgetCount >= 12) {
                return { message: "You can only have at most 12 budgets at once" };
            }
        }
        const amountInCents = Math.floor(validatedBudgetData.data.amount * 100);
        const budgetFormData: BudgetFormData = {
            name: validatedBudgetData.data.name,
            category_id: categoryId,
            currency: validatedBudgetData.data.currency,
            amount: amountInCents,
            user_id: user.id,
            description: validatedBudgetData.data.description,
        };
        const { error: createBudgetError } = await supabase.from("budgets").insert(budgetFormData);
        if (createBudgetError) {
            return { message: createBudgetError.message };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }

    redirect("/dashboard/budget/my-budgets");
}

export async function updateBudget(
    prevState: BudgetFormState | undefined,
    formData: FormData,
): Promise<BudgetFormState | undefined> {
    try {
        const budgetId = formData.get("budget_id");
        const name = formData.get("name");
        const currency = formData.get("currency");
        const amount = formData.get("amount");
        const category = formData.get("category");
        const description = formData.get("description");
        
        if (!budgetId) {
            return { message: "Error: budget ID not found" };
        }
        const validatedBudgetData = BudgetSchema.safeParse({
            name,
            currency,
            amount,
            category,
            description,
        });
        if (!validatedBudgetData.success) {
            return {
                error: validatedBudgetData.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            }
        }

        const validatedBudgetCategory = BudgetCategorySchema.safeParse(validatedBudgetData.data.category);
        if (!validatedBudgetCategory.success) {
            return { message: "Please select a category for this budget" };
        }
        const categoryId = validatedBudgetCategory.data;

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        const amountInCents = Math.floor(validatedBudgetData.data.amount * 100);
        const budgetFormData: BudgetFormData = {
            name: validatedBudgetData.data.name,
            category_id: categoryId,
            currency: validatedBudgetData.data.currency,
            amount: amountInCents,
            user_id: user.id,
            description: validatedBudgetData.data.description,
            updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
            .from("budgets")
            .update(budgetFormData)
            .eq("budget_id", budgetId);
        if (error) {
            return { message: error.message };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }

    redirect("/dashboard/budget/my-budgets");
}

export async function deleteBudget(
    budgetId: string,
    redirectOnDelete?: boolean,
): Promise<BudgetFormState | undefined> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("budget_id", budgetId);
    if (error) {
        return { message: error.message };
    }
    revalidatePath("/dashboard/budget");
    if (redirectOnDelete) {
        redirect("/dashboard/budget/my-budgets");
    }
}