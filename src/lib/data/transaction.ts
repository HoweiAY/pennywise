import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { DataResponse } from "@/lib/types/data";
import { TransactionFormData } from "@/lib/types/form-state";
import { TransactionItem } from "@/lib/types/transactions";
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
    type: "Income" | "Expenditure",
    from: Date,
    to: Date,
): Promise<DataResponse<number | null>> {
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
            message: error.message,
        };
    }
    return {
        status:"success",
        data: { transactionAmount: transactionAmountData[0].totalAmount as number || null },
    };
}