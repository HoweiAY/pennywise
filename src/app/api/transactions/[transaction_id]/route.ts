import { TransactionFormData } from "@/lib/types/form-state";
import { TransactionItem } from "@/lib/types/transactions";
import { RouteHandlerResponse } from "@/lib/types/data";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ transaction_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<TransactionItem | TransactionFormData>>> {
    const searchParams = request.nextUrl.searchParams;
    const asForm = searchParams.get("asForm");
    const { transaction_id: transactionId } = await params;
    const supabase = await createSupabaseServerClient();
    let supabaseQuery;
    if (asForm === "true") {
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
            payer_data:users!transactions_payer_id_fkey(username, avatar_url),
            recipient_data:users!transactions_recipient_id_fkey(username, avatar_url),
            budget_data:budgets!transactions_budget_id_fkey(name, category_id),
            description,
            created_at
        `);
    }
    supabaseQuery = supabaseQuery.eq("transaction_id", transactionId).limit(1);
    const { data: transactionData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    if (transactionData.length === 0) {
        return NextResponse.json({}, { status: 404, statusText: "Transaction not found" });
    }
    return NextResponse.json(
        { data: asForm ? transactionData[0] as TransactionFormData : transactionData[0] as TransactionItem },
        { status: 200 },
    );
}