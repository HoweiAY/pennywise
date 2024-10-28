"use server";

import { z } from "zod";
import { addUserBalance, deductUserBalance } from "@/lib/actions/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { TransactionFormState, TransactionFormData } from "@/lib/types/form-state";
import { TransactionCategoryId, TransactionType } from "@/lib/types/transactions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
const TransactionCategorySchema = z.custom<TransactionCategoryId>().nullable();

// Server action for creating a new transaction
export async function createTransaction(
    prevState: TransactionFormState | undefined,
    formData: FormData,
): Promise<TransactionFormState | undefined> {
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

        const validatedTransactionCategory = TransactionCategorySchema.safeParse(validatedTransactionData.data.category);
        if (!validatedTransactionCategory.success) {
            return { message: "Invalid category ID" };
        }
        const categoryId = validatedTransactionCategory.data;

        const amountInCents = Math.floor(validatedTransactionData.data.amount * 100);
        const {
            balance: balanceInCents,
            remainingSpendingLimit: remainingSpendingLimitInCents,
            remainingBudgetAmount: remainingBudgetAmountInCents,
            type: transactionType,
        } = validatedTransactionData.data;
        const budgetId = validatedTransactionData.data.budget;
        if (transactionType !== "Deposit") {
            const message = (amountInCents > balanceInCents)
                ? "Transaction amount has exceeded your available balance"
                : (remainingSpendingLimitInCents && amountInCents > remainingSpendingLimitInCents)
                ? "Transaction amount has exceeded your spending limit"
                : ((budgetId && categoryId) || !(budgetId || categoryId))
                ? "Please select either a budget or a category"
                : (budgetId && remainingBudgetAmountInCents && amountInCents > remainingBudgetAmountInCents)
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
            transactionData.category_id = categoryId;
            transactionData.payer_id = user.id;
            transactionData.payer_currency = validatedTransactionData.data.currency;
        }
        const updateBalanceAction = transactionData.transaction_type === "Deposit"
            ? addUserBalance(user.id, amountInCents, supabase)
            : deductUserBalance(user.id, amountInCents, supabase);
        
        Promise.all([
            supabase.from("transactions").insert(transactionData),
            updateBalanceAction,
        ]).then(res => {
            const [
                { error: supabaseError },
                { status: updateBalanceStatus, message: updateBalanceMessage },
            ] = res;
            if (supabaseError) {
                return { message: supabaseError.message };
            }
            if (updateBalanceStatus !== "success") {
                return { message: updateBalanceMessage ?? "Failed to update user balance" };
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

// Server action for updating a transaction
export async function updateTransaction(
    prevState: TransactionFormState | undefined,
    formData: FormData,
): Promise<TransactionFormState | undefined> {
    try {
        const transactionId = formData.get("transaction_id");
        const title = formData.get("title");
        const currency = formData.get("currency");
        const amount = formData.get("amount");
        const prevAmount = formData.get("prev_amount");
        const balance = formData.get("balance");
        const remainingSpendingLimit = formData.get("remaining_spending_limit");
        const type = formData.get("type");
        const budget = formData.get("budget");
        const remainingBudgetAmount = formData.get("remaining_budget_amount");
        const category = formData.get("category");
        const description = formData.get("description");

        if (!transactionId) {
            return { message: "Error: transaction ID not found" };
        }

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

        const validatedTransactionCategory = TransactionCategorySchema.safeParse(validatedTransactionData.data.category);
        if (!validatedTransactionCategory.success) {
            return { message: "Invalid category ID" };
        }
        const categoryId = validatedTransactionCategory.data;

        const amountInCents = Math.floor(validatedTransactionData.data.amount * 100);
        const prevAmountInCents = prevAmount ? parseInt(prevAmount.toString()) : amountInCents;
        const netAmountInCents = amountInCents - prevAmountInCents;
        const {
            balance: balanceInCents,
            remainingSpendingLimit: remainingSpendingLimitInCents,
            remainingBudgetAmount: remainingBudgetAmountInCents,
            type: transactionType,
        } = validatedTransactionData.data;
        const budgetId = validatedTransactionData.data.budget;
        if (transactionType !== "Deposit") {
            const message = (netAmountInCents > balanceInCents)
                ? "Transaction amount has exceeded your available balance"
                : (remainingSpendingLimitInCents && netAmountInCents > remainingSpendingLimitInCents)
                ? "Transaction amount has exceeded your spending limit"
                : ((budgetId && categoryId) || !(budgetId || categoryId))
                ? "Please select either a budget or a category"
                : (budgetId && remainingBudgetAmountInCents && netAmountInCents > remainingBudgetAmountInCents)
                ? "Transaction amount has exceeded your budget amount"
                : null;
            if (message) {
                return { message };
            }
        } else if (netAmountInCents < 0 && balanceInCents < Math.abs(netAmountInCents)) {
            return { message: "Deducted deposit amount has exceeded your available balance" };
        }

        const transactionData: TransactionFormData = {
            title: validatedTransactionData.data.title,
            transaction_type: validatedTransactionData.data.type,
            amount: amountInCents,
            description: validatedTransactionData.data.description,
        };
        if (transactionType !== "Deposit") {
            transactionData.budget_id = budgetId;
            transactionData.category_id = categoryId;
        }

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        const updateBalanceAction = transactionType === "Deposit"
            ? netAmountInCents >= 0
                ? addUserBalance(user.id, netAmountInCents, supabase)
                : deductUserBalance(user.id, Math.abs(netAmountInCents), supabase)
            : netAmountInCents < 0
                ? addUserBalance(user.id, Math.abs(netAmountInCents), supabase)
                : deductUserBalance(user.id, netAmountInCents, supabase);
        Promise.all([
            supabase.from("transactions").update(transactionData).eq("transaction_id", transactionId.toString()),
            updateBalanceAction,
        ]).then(res => {
            const [
                { error: supabaseError },
                { status: updateBalanceStatus, message: updateBalanceMessage },
            ] = res;
            if (supabaseError) {
                return { message: supabaseError.message };
            }
            if (updateBalanceStatus !== "success") {
                return { message: updateBalanceMessage ?? "Failed to update user balance" };
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

// Server action for deleting a transaction
export async function deleteTransaction(
    transactionId: string,
    redirectOnDelete?: boolean,
): Promise<TransactionFormState | undefined> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
    
    const { data: transactionData, error: transactionDataError } = await supabase
        .from("transactions")
        .select("transaction_type, amount")
        .eq("transaction_id", transactionId)
        .limit(1);
    if (transactionDataError) {
        return { message: transactionDataError.message };
    }
    const {
        transaction_type: transactionType,
        amount,
    }: {
        transaction_type: TransactionType,
        amount: number,
    } = transactionData[0];
    const changeBalanceAction = transactionType === "Deposit"
        ? deductUserBalance(user.id, amount, supabase)
        : addUserBalance(user.id, amount, supabase);

    const [
        { status: changeBalanceStatus, message: changeBalanceMessage },
        { error: deleteTransactionError },
    ] = await Promise.all([
        changeBalanceAction,
        supabase.from("transactions").delete().eq("transaction_id", transactionId),
    ]);
    if (changeBalanceStatus !== "success") {
        return { message: changeBalanceMessage || "Failed to update user balance" };
    }
    if (deleteTransactionError) {
        return { message: deleteTransactionError.message };
    }
    revalidatePath("/dashboard/transactions");
    if (redirectOnDelete) {
        redirect("/dashboard/transactions");
    }
}