"use server";

import { z } from "zod";
import { addUserBalance, deductUserBalance } from "@/lib/actions/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { TransactionFormState, TransactionFormData } from "@/lib/types/form-state";
import { TransactionItem, TransactionType } from "@/lib/types/transactions";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

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
): Promise<TransactionFormState> {
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

export async function deleteTransaction(
    transactionId: string,
    redirectOnDelete?: boolean,
): Promise<{ errorMessage?: string }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { errorMessage: "Error: user not found" };
        }
    
    const { data: transactionData, error: transactionDataError } = await supabase
        .from("transactions")
        .select("transaction_type, amount")
        .eq("transaction_id", transactionId)
        .limit(1);
    if (transactionDataError) {
        return { errorMessage: transactionDataError.message };
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
    try {
        await changeBalanceAction;
    } catch (error) {
        if (error instanceof Error) {
            return { errorMessage: error.message };
        }
        return { errorMessage: "Error: cannot change user balance" };
    }
    
    const { error: deleteTransactionError } = await supabase
        .from("transactions")
        .delete()
        .eq("transaction_id", transactionId);
    if (deleteTransactionError) {
        return { errorMessage: deleteTransactionError.message };
    }
    revalidatePath("/dashboard/transactions");
    if (redirectOnDelete) {
        redirect("/dashboard/transactions");
    }
    
    return {};
}

// Server action for transactions table pagination
export async function getTransactionsPages(
    itemsPerPage: number,
    searchQuery: string
): Promise<{
    totalPageCount?: number,
    errorMessage?: string,
}> {
    noStore();

    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            redirect("/login");
        }
        let supabaseQuery = supabase
            .from("transactions")
            .select("transactionCount:count()");
        if (searchQuery) {
            const splitSearchQuery = searchQuery.trim().split(" ");
            const searchTerms = splitSearchQuery.reduce((prevTerms, term) => term ? `${prevTerms ? prevTerms + " | " : ""}'${term}'` : prevTerms, ``);
            supabaseQuery = supabaseQuery.textSearch("title", searchTerms);
        }
        supabaseQuery = supabaseQuery
            .or(`payer_id.eq.${user.id}, recipient_id.eq.${user.id}`)
            .limit(1);
        const { data: transactionCountData, error } = await supabaseQuery;
        if (error) throw error;
        const { transactionCount } = transactionCountData[0] as { transactionCount: number };
        return { totalPageCount: Math.ceil(transactionCount / itemsPerPage) };
    } catch (error) {
        if (error instanceof Error) {
            return { errorMessage: error.message };
        }
        return { errorMessage: "Transaction pagination information fetch failed" };
    }
}

// Server action for getting queried transactions
export async function getFilteredTransactions(
    searchQuery: string,
    currPage: number,
    itemsPerPage: number
): Promise<{
    transactionItems?: TransactionItem[],
    errorMessage?: string,
}> {
    noStore();

    try {
        const pageOffset = (currPage - 1) * itemsPerPage;
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            redirect("/login");
        }
        let supabaseQuery = supabase
            .from("transactions")
            .select(`
                transaction_id,
                title,
                payer_currency,
                recipient_currency,
                exchange_rate,
                amount,
                transaction_type,
                category_id,
                payer_data:users!transactions_payer_id_fkey(avatar_url),
                recipient_data:users!transactions_recipient_id_fkey(avatar_url),
                description,
                created_at
            `)
            .or(`payer_id.eq.${user.id}, recipient_id.eq.${user.id}`);
        if (searchQuery) {
            const splitSearchQuery = searchQuery.trim().split(" ");
            const searchTerms = splitSearchQuery.reduce((prevTerms, term) => term ? `${prevTerms ? prevTerms + " & " : ""}'${term}'` : prevTerms, ``);
            supabaseQuery = supabaseQuery.textSearch("title", searchTerms);
        }
        supabaseQuery = supabaseQuery
            .order("updated_at", { ascending: false })
            .range(pageOffset, pageOffset + itemsPerPage - 1)
            .limit(itemsPerPage);
        const { data: transactionsData, error } = await supabaseQuery;
        if (error) throw error;
        return { transactionItems: transactionsData };
    } catch (error) {
        if (error instanceof Error) {
            return { errorMessage: error.message };
        }
        return { errorMessage: "Transaction items fetch failed" };
    }
}