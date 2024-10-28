import { RouteHandlerResponse } from "@/lib/types/data";
import { TransactionItem } from "@/lib/types/transactions";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<TransactionItem[]>>> {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search");
    const items = searchParams.get("items");
    const offset = searchParams.get("offset");
    const pageOffset = searchParams.get("pageOffset");
    const { user_id: userId } = await params;

    const itemsCount = items && !isNaN(parseInt(items)) ? parseInt(items) : 10;
    let itemsOffset = 0;
    if (offset && !isNaN(parseInt(offset))) {
        itemsOffset = Math.abs(parseInt(offset));
    } else if (pageOffset && !isNaN(parseInt(pageOffset))) {
        itemsOffset = Math.abs(parseInt(pageOffset)) * itemsCount;
    }

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
        .or(`payer_id.eq.${userId}, recipient_id.eq.${userId}`);
    if (searchQuery) {
        const splitSearchQuery = searchQuery.trim().split(" ");
        const searchTerms = splitSearchQuery.reduce((prevTerms, term) => term ? `${prevTerms ? prevTerms + " & " : ""}'${term}'` : prevTerms, ``);
        supabaseQuery = supabaseQuery.textSearch("title", searchTerms);
    }
    supabaseQuery = supabaseQuery.order("created_at", { ascending: false });
    if (itemsOffset) {
        supabaseQuery = supabaseQuery.range(itemsOffset, itemsOffset + itemsCount - 1);
    } else if (items) {
        supabaseQuery = supabaseQuery.limit(itemsCount);
    }
    const { data: transactionsData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    return NextResponse.json(
        { data: transactionsData as TransactionItem[] },
        { status: 200 },
    );
}