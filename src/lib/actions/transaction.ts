"use server";

import { z } from "zod";
import { addUserBalance, deductUserBalance } from "@/lib/actions/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { TransactionFormState, TransactionFormData } from "@/lib/types/form-state";
import { TransactionItem, TransactionType } from "@/lib/types/transactions";
import { ServerActionResponse } from "@/lib/types/action";
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

        const amountInCents = Math.floor(validatedTransactionData.data.amount * 100);
        const {
            balance: balanceInCents,
            remainingSpendingLimit: remainingSpendingLimitInCents,
            remainingBudgetAmount: remainingBudgetAmountInCents,
            type: transactionType,
        } = validatedTransactionData.data;
        const budgetId = validatedTransactionData.data.budget;
        const categoryId = validatedTransactionData.data.category;
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
        const categoryId = validatedTransactionData.data.category;
        console.log(`budget: ${budgetId}`);
        console.log(`category: ${categoryId}`);
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
export async function deleteTransaction(transactionId: string): Promise<ServerActionResponse<void>> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                status: "error",
                code: 401,
                message: "Error: user not found",
            };
        }
    
    const { data: transactionData, error: transactionDataError } = await supabase
        .from("transactions")
        .select("transaction_type, amount")
        .eq("transaction_id", transactionId)
        .limit(1);
    if (transactionDataError) {
        return {
            status: "error",
            code: 500,
            message: transactionDataError.message,
        };
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
        { status: changeBalanceStatus, code: changeBalanceCode, message: changeBalanceMessage },
        { error: deleteTransactionError },
    ] = await Promise.all([
        changeBalanceAction,
        supabase.from("transactions").delete().eq("transaction_id", transactionId),
    ]);
    if (changeBalanceStatus !== "success") {
        return {
            status: changeBalanceStatus,
            code: changeBalanceCode,
            message: changeBalanceMessage || "Failed to update user balance",
        };
    }
    if (deleteTransactionError) {
        return {
            status: "error",
            code: 500,
            message: deleteTransactionError.message,
        };
    }
    revalidatePath("/dashboard/transactions");
    return { status: "success", code: 204 };
}

// Server action for transactions table pagination
export async function getTransactionsPages(
    itemsPerPage: number,
    searchQuery: string
): Promise<ServerActionResponse<number>> {
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
        return {
            status: "success",
            code: 200,
            data: { totalPageCount: Math.ceil(transactionCount / itemsPerPage) },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                code: 500,
                message: error.message,
            };
        }
        return {
            status: "error",
            code: 500,
            message: "Transaction pagination information fetch failed",
        };
    }
}

// Server action for getting queried transactions
export async function getFilteredTransactions(
    searchQuery: string,
    currPage: number,
    itemsPerPage: number
): Promise<ServerActionResponse<TransactionItem[]>> {
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
                payer_id,
                recipient_id,
                budget_id,
                payer_data:users!transactions_payer_id_fkey(username, first_name, last_name, avatar_url),
                recipient_data:users!transactions_recipient_id_fkey(username, first_name, last_name, avatar_url),
                budget_data:budgets!transactions_budget_id_fkey(category_id),
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
        return {
            status: "success",
            code: 200,
            data: { transactionItems: transactionsData as TransactionItem[] },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                code: 500,
                message: error.message,
            };
        }
        return {
            status: "error",
            code: 500,
            message: "Transaction items fetch failed",
        };
    }
}

// Server action for fetching a transaction with a given ID
export async function getTransactionById(
    transactionId: string,
    asForm?: boolean,
): Promise<ServerActionResponse<TransactionItem | TransactionFormData>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    let supabaseQuery;
    if (!asForm) {
        supabaseQuery = supabase.from("transactions").select(`
            title,
            transaction_type,
            category_id,
            payer_currency,
            recipient_currency,
            exchange_rate,
            amount,
            payer_id,
            recipient_id,
            budget_id,
            payer_data:users!transactions_payer_id_fkey(username, avatar_url),
            recipient_data:users!transactions_recipient_id_fkey(username, avatar_url),
            budget_data:budgets!transactions_budget_id_fkey(name, category_id),
            description,
            created_at
        `);
    } else {
        supabaseQuery = supabase.from("transactions").select(`
            title,
            transaction_type,
            category_id,
            payer_currency,
            recipient_currency,
            exchange_rate,
            amount,
            payer_id,
            recipient_id,
            budget_id,
            description,
            created_at
        `);
    }
    supabaseQuery = supabaseQuery.eq("transaction_id", transactionId).limit(1);
    const { data: transactionData, error } = await supabaseQuery;
    if (error) {
        return {
            status: "error",
            code: 500,
            message: error.message,
        };
    }
    return {
        status: "success",
        code: 200,
        data: {
            transactionData: asForm
                ? transactionData[0] as TransactionFormData
                : transactionData[0] as TransactionItem
        },
    };
}

// Server action for getting total transaction amount within a time period
export async function getTotalTransactionAmount(
    userId: string,
    type: "Income" | "Expenditure",
    from: Date,
    to: Date,
): Promise<ServerActionResponse<number>> {
    noStore();

    const matchingColumn = type === "Income" ? "recipient_id" : "payer_id";
    const supabase = await createSupabaseServerClient();
    const { data: transactionAmountData, error } = await supabase
        .from("transactions")
        .select("totalAmount:amount.sum()")
        .eq(matchingColumn, userId)
        .lt("created_at", to.toISOString())
        .gte("created_at", from.toISOString());
    if (error) {
        return {
            status: "error",
            code: 500,
            message: error.message,
        };
    }
    return {
        status:"success",
        code: 200,
        data: { transactionAmount: transactionAmountData[0].totalAmount as number },
    };
}