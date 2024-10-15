"use server";

import { z } from "zod";
import { addUserBalance, deductUserBalance } from "@/lib/actions/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { TransactionFormState, TransactionFormData } from "@/lib/types/form-state";
import { redirect } from "next/navigation";

const TransactionSchema = z.object({
    title: z.string().trim().min(1, { message: "Please give your transaction a title" }),
    currency: z.string(),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than 0" }),
    type: z.enum(["Deposit", "Expense", "Pay friend"], { invalid_type_error: "Please select a transaction type" }),
    budget: z.string().nullable(),
    category: z.coerce.number().nullable(),
    description: z.string().trim().nullable(),
});

// Server action for creating a new transaction
export async function createTransaction(
    prevState: TransactionFormState | undefined,
    formData: FormData,
) {
    try {
        const title = formData.get("title");
        const currency = formData.get("currency");
        const amount = formData.get("amount");
        const type = formData.get("type");
        const budget = formData.get("budget");
        const category = formData.get("category");
        const description = formData.get("description");

        const validatedTransactionData = TransactionSchema.safeParse({
            title,
            currency,
            amount,
            type,
            budget,
            category,
            description,
        });
        if (!validatedTransactionData.success) {
            return {
                error: validatedTransactionData.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            }
        }
        const transactionType = validatedTransactionData.data.type;
        if (transactionType !== "Deposit" && ((budget && category) || !(budget || category))) {
            return { message: "Please select either a budget or a category" };
        }

        const amountInCents = Math.floor(validatedTransactionData.data.amount * 100);
        const transactionData: TransactionFormData = {
            title: validatedTransactionData.data.title,
            transaction_type: validatedTransactionData.data.type,
            category_id: validatedTransactionData.data.category,
            amount: amountInCents,
            description: validatedTransactionData.data.description,
        };

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        if (transactionData.transaction_type === "Deposit") {
            transactionData.recipient_id = user.id;
            transactionData.recipient_currency = validatedTransactionData.data.currency;
        } else {
            transactionData.payer_id = user.id;
            transactionData.payer_currency = validatedTransactionData.data.currency;
        }
        const { error } = await supabase.from("transactions").insert(transactionData);
        if (error) {
            return { message: error.message };
        }

        try {
            if (transactionData.transaction_type === "Deposit") {
                await addUserBalance(user.id, amountInCents, supabase);
            } else {
                await deductUserBalance(user.id, amountInCents, supabase);
            }
        } catch (error) {
            if (error instanceof Error) {
                return { message: error.message };
            }
            throw new Error();
        }      
    } catch (error) {
        return { message: "An error has occurred" };
    }

    redirect("/dashboard/transactions");
}