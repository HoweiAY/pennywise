import { RouteHandlerResponse } from "@/lib/types/data";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string, type: string }> },
): Promise<NextResponse<RouteHandlerResponse<{ transactionAmount: number }>>> {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const { user_id: userId, type } = await params;
    const supabase = await createSupabaseServerClient();
    const matchingColumn = type === "income"
        ? "recipient_id"
        : type === "expenditure"
        ? "payer_id"
        : null;
    if (!matchingColumn) {
        return NextResponse.json({}, { status: 400, statusText: "Invalid transaction type" });
    }
    let supabaseQuery = supabase
        .from("transactions")
        .select("totalAmount:amount.sum()")
        .eq(matchingColumn, userId);
    if (to) {
        supabaseQuery = supabaseQuery.lt("created_at", to);
    }
    if (from) {
        supabaseQuery = supabaseQuery.gte("created_at", from);
    }
    supabaseQuery = supabaseQuery.limit(1);
    const { data: transactionAmountData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    const { totalAmount } = transactionAmountData[0];
    return NextResponse.json(
        { data: { transactionAmount: totalAmount ?? 0 } },
        { status: 200 },
    );
}