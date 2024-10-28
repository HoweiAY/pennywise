import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { RouteHandlerResponse } from "@/lib/types/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<{ totalPageCount?: number }>>> {
    const searchParams = request.nextUrl.searchParams;
    const itemsPerPage = searchParams.get("itemsPerPage");
    const searchQuery = searchParams.get("search");
    const budgetId = searchParams.get("budgetId");
    const { user_id: userId } = await params;
    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("transactions")
        .select("transactionCount:count()");
    if (searchQuery) {
        const splitSearchQuery = searchQuery.trim().split(" ");
        const searchTerms = splitSearchQuery.reduce((prevTerms, term) => term ? `${prevTerms ? prevTerms + " | " : ""}'${term}'` : prevTerms, ``);
        supabaseQuery = supabaseQuery.textSearch("title", searchTerms);
    }
    if (userId) {
        supabaseQuery = supabaseQuery.or(`payer_id.eq.${userId}, recipient_id.eq.${userId}`);
    }
    if (budgetId) {
        supabaseQuery = supabaseQuery.eq("budget_id", budgetId);
    }
    supabaseQuery = supabaseQuery.limit(1);
    const { data: transactionCountData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    const { transactionCount } = transactionCountData[0] as { transactionCount: number };
    return NextResponse.json(
        { data: { totalPageCount: itemsPerPage ? Math.ceil(transactionCount / parseInt(itemsPerPage)) : transactionCount } },
        { status: 200 },
    );
}