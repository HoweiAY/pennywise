import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { DataResponse } from "@/lib/types/data";
import { TransactionFormData } from "@/lib/types/form-state";
import { TransactionCategoryId, TransactionItem } from "@/lib/types/transactions";
import { BudgetCategoryId } from "@/lib/types/budget";
import { getBudgetAmountSpentByCategory } from "@/lib/data/budget";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export async function getTransactionsPages(
    itemsPerPage: number,
    searchQuery: string | null,
    budgetId?: string,
): Promise<DataResponse<number>> {
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
        if (budgetId) {
            supabaseQuery = supabaseQuery.eq("budget_id", budgetId);
        } else {
            supabaseQuery = supabaseQuery.or(`payer_id.eq.${user.id}, recipient_id.eq.${user.id}`);
        }
        supabaseQuery = supabaseQuery.limit(1);
        const { data: transactionCountData, error } = await supabaseQuery;
        if (error) throw error;
        const { transactionCount } = transactionCountData[0] as { transactionCount: number };
        return {
            status: "success",
            data: { totalPageCount: Math.ceil(transactionCount / itemsPerPage) },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                message: error.message,
            };
        }
        return {
            status: "error",
            message: "Transaction pagination information fetch failed",
        };
    }
}

export async function getFilteredTransactions(
    searchQuery: string,
    currPage: number,
    itemsPerPage: number,
): Promise<DataResponse<TransactionItem[]>> {
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
            .order("created_at", { ascending: false })
            .range(pageOffset, pageOffset + itemsPerPage - 1)
            .limit(itemsPerPage);
        const { data: transactionsData, error } = await supabaseQuery;
        if (error) throw error;
        return {
            status: "success",
            data: { transactionItems: transactionsData as TransactionItem[] },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                message: error.message,
            };
        }
        return {
            status: "error",
            message: "Transaction items fetch failed",
        };
    }
}

export async function getBudgetTransactions(
    budgetId: string,
    currPage?: number,
    itemsPerPage?: number,
): Promise<DataResponse<TransactionItem[]>> {
    noStore();

    try {
        const pageOffset = currPage && itemsPerPage ? (currPage - 1) * itemsPerPage : null;
        const supabase = await createSupabaseServerClient();
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
            .eq("budget_id", budgetId)
            .order("created_at", { ascending: false });
        if (pageOffset && itemsPerPage) {
            supabaseQuery = supabaseQuery
                .range(pageOffset, pageOffset + itemsPerPage - 1)
                .limit(itemsPerPage);
        }
        const { data: transactionsData, error } = await supabaseQuery;
        if (error) throw error;
        return {
            status: "success",
            data: { transactionItems: transactionsData as TransactionItem[] },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                message: error.message,
            };
        }
        return {
            status: "error",
            message: "Transaction items fetch failed",
        };
    }
}

export async function getPayFriendTransactions(
    userId: string,
    friendId?: string,
    itemsLimit?: number,
): Promise<DataResponse<TransactionItem[]>> {
    noStore();

    try {
        const supabase = await createSupabaseServerClient();
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
            .eq("transaction_type", "Pay friend");
        if (friendId) {
            supabaseQuery = supabaseQuery.or(`and(payer_id.eq.${userId},recipient_id.eq.${friendId}),and(payer_id.eq.${friendId},recipient_id.eq.${userId})`);
        } else {
            supabaseQuery = supabaseQuery.or(`payer_id.eq.${userId}, recipient.eq.${userId}`);
        }
        if (itemsLimit && !isNaN(itemsLimit)) {
            supabaseQuery = supabaseQuery.limit(itemsLimit);
        }
        const { data: payFriendTransactionsData, error } = await supabaseQuery;
        if (error) throw error;
        return {
            status: "success",
            data: { transactionItems: payFriendTransactionsData as TransactionItem[] },
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: "error",
                message: error.message,
            };
        }
        return {
            status: "error",
            message: "Pay friend transaction items fetch failed",
        };
    }
}

export async function getTransactionById(
    transactionId: string,
    asForm?: boolean,
): Promise<DataResponse<TransactionItem | TransactionFormData>> {
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
            message: error.message,
        };
    }
    return {
        status: "success",
        data: transactionData.length > 0
            ? { transactionData: asForm ? transactionData[0] as TransactionFormData : transactionData[0] as TransactionItem }
            : null,
    };
}

export async function getTotalTransactionAmount(
    userId: string,
    type: "income" | "expenditure",
    from: Date,
    to: Date,
): Promise<DataResponse<number | null>> {
    noStore();

    const matchingColumn = type === "income" ? "recipient_id" : "payer_id";
    const supabase = await createSupabaseServerClient();
    const { data: transactionAmountData, error: transactionAmountError } = await supabase
        .from("transactions")
        .select("totalAmount:amount.sum()")
        .eq(matchingColumn, userId)
        .is("exchange_rate", null)
        .lt("created_at", to.toISOString())
        .gte("created_at", from.toISOString());
    if (transactionAmountError) {
        return {
            status: "error",
            message: transactionAmountError.message,
        };
    }
    const { data: fxTransactionAmountData, error: fxTransactionAmountError } = await supabase
        .from("transactions")
        .select("amount, exchange_rate, payer_id, recipient_id")
        .eq(matchingColumn, userId)
        .not("exchange_rate", "is", null)
        .lt("created_at", to.toISOString())
        .gte("created_at", from.toISOString());
    if (fxTransactionAmountError) {
        return {
            status: "error",
            message: fxTransactionAmountError.message,
        };
    }
    const exchangedAmount = fxTransactionAmountData.reduce((amount, transaction) => {
        return amount += transaction.recipient_id === userId ? Math.trunc(transaction.amount * transaction.exchange_rate) : transaction.amount;
    }, 0);
    return {
        status:"success",
        data: { transactionAmount: transactionAmountData[0].totalAmount + exchangedAmount as number || null },
    };
}

export async function getTotalExpenseByCategoryId(
    userId: string,
    categoryId: TransactionCategoryId | BudgetCategoryId,
    from?: Date,
    to?: Date,
): Promise<DataResponse<number | null>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    let supabaseTransactionsQuery = supabase
        .from("transactions")
        .select("transactionsAmount:amount.sum()")
        .eq("payer_id", userId)
        .eq("category_id", categoryId);
    if (to) {
        supabaseTransactionsQuery = supabaseTransactionsQuery.lt("created_at", to.toISOString());
    }
    if (from) {
        supabaseTransactionsQuery = supabaseTransactionsQuery.gte("created_at", from.toISOString());
    }

    const [
        { data: transactionsAmountData, error: transactionsAmountError },
        { status: spentBudgetStatus, message: spentBudgetMessage, data: spentBudgetData },
    ] = await Promise.all([
        supabaseTransactionsQuery,
        getBudgetAmountSpentByCategory(userId, categoryId, from, to),
    ]);
    if (transactionsAmountError) {
        return {
            status: "error",
            message: transactionsAmountError.message,
        };
    }
    if (spentBudgetStatus !== "success") {
        return {
            status: "error",
            message: spentBudgetMessage,
        }
    }
    const totalAmount = spentBudgetData
        ? transactionsAmountData[0].transactionsAmount + (spentBudgetData["spentBudget"] ?? 0)
        : transactionsAmountData[0].transactionsAmount;
    return {
        status:"success",
        data: { expenseAmount: totalAmount as number || null },
    };
}