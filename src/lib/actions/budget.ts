"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { BudgetFormState, BudgetFormData } from "@/lib/types/form-state";
import { redirect } from "next/navigation";

const BudgetSchema = z.object({
    name: z.string().trim().min(1, { message: "Please give your budget a name" }),
    currency: z.string(),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than 0" }),
    category: z.coerce.number().gt(0, { message: "Please select a category" }),
    description: z.string().trim().nullable(),
});

export async function createBudget(
    prevState: BudgetFormState | undefined,
    formData: FormData,
) {
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

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        const amountInCents = Math.floor(validatedBudgetData.data.amount * 100);
        const budgetFormData: BudgetFormData = {
            name: validatedBudgetData.data.name,
            category_id: validatedBudgetData.data.category,
            currency: validatedBudgetData.data.currency,
            amount: amountInCents,
            user_id: user.id,
            description: validatedBudgetData.data.description,
        };
        const { error } = await supabase.from("budgets").insert(budgetFormData);
        if (error) {
            return { message: error.message };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }

    redirect("/dashboard/budget");
}

export async function updateBudget(
    prevState: BudgetFormState | undefined,
    formData: FormData,
) {
    return undefined;
}