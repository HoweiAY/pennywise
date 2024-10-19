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
    balance: z.coerce.number(),
    remainingSpendingLimit: z.coerce.number().nullable(),
    type: z.enum(["Deposit", "Expense", "Pay friend"], { invalid_type_error: "Please select a transaction type" }),
    budget: z.string().nullable(),
    remainingBudgetAmount: z.coerce.number().nullable(),
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
        const balance = formData.get("balance");
        const remainingSpendingLimit = formData.get("remaining_spending_limit");
        const type = formData.get("type");
        const budget = formData.get("budget");
        const remainingBudgetAmount = formData.get("remaining_budget_amount");
        const category = formData.get("category");
        const description = formData.get("description");

        const validatedTransactionData = TransactionSchema.safeParse({
            title,
            currency,
            amount,
            balance,
            remainingSpendingLimit,
            type,
            budget,
            remainingBudgetAmount,
            category,
            description,
        });
        if (!validatedTransactionData.success) {
            return {
                error: validatedTransactionData.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            }
        }
        const amountInCents = Math.floor(validatedTransactionData.data.amount * 100);
        const {
            balance: balanceInCents,
            remainingSpendingLimit: remainingSpendingLimitInCents,
            remainingBudgetAmount: remainingBudgetAmountInCents,
            type: transactionType,
        } = validatedTransactionData.data;
        if (transactionType !== "Deposit") {
            const message = (amountInCents > balanceInCents)
                ? "Transaction amount has exceeded your available balance"
                : (remainingSpendingLimitInCents && amountInCents > remainingSpendingLimitInCents)
                ? "Transaction amount has exceeded your spending limit"
                : ((budget && category) || !(budget || category))
                ? "Please select either a budget or a category"
                : (budget && remainingBudgetAmountInCents && amountInCents > remainingBudgetAmountInCents)
                ? "Transaction amount has exceeded your budget amount"
                : null;
            if (message) {
                return { message };
            }
        }
        const transactionData: TransactionFormData = {
            title: validatedTransactionData.data.title,
            transaction_type: validatedTransactionData.data.type,
            amount: amountInCents,
            description: validatedTransactionData.data.description,
        };
        const budgetId = validatedTransactionData.data.budget;
        if (transactionType !== "Deposit" && budgetId) {
            transactionData.budget_id = budgetId;
        }

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        if (transactionData.transaction_type === "Deposit") {
            transactionData.recipient_id = user.id;
            transactionData.recipient_currency = validatedTransactionData.data.currency;
        } else {
            transactionData.category_id = validatedTransactionData.data.category;
            transactionData.payer_id = user.id;
            transactionData.payer_currency = validatedTransactionData.data.currency;
        }
        const changeBalancePromise = transactionData.transaction_type === "Deposit"
            ? addUserBalance(user.id, amountInCents, supabase)
            : deductUserBalance(user.id, amountInCents, supabase);
        
        Promise.all([
            supabase.from("transactions").insert(transactionData),
            changeBalancePromise,
        ]).then(res => {
            const { error } = res[0];
            if (error) {
                return { message: error.message };
            }
        }).catch(error => {
            if (error instanceof Error) {
                return { message: error.message };
            }
            throw new Error();
        });
    } catch (error) {
        return { message: "An error has occurred" };
    }

    redirect("/dashboard/transactions");
}