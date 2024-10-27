import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { RouteHandlerResponse } from "@/lib/types/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ budget_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<{ spentBudget?: number }>>> {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const { budget_id: budgetId } = await params;
    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("transactions")
        .select("spentBudget:amount.sum()")
        .eq("budget_id", budgetId);
    if (to) {
        supabaseQuery = supabaseQuery.lt("created_at", to);
    }
    if (from) {
        supabaseQuery = supabaseQuery.gte("created_at", from);
    }
    supabaseQuery = supabaseQuery.limit(1);
    const { data: spentBudgetData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    const { spentBudget } = spentBudgetData[0] as { spentBudget: number };
    return NextResponse.json(
        { data: { spentBudget } },
        { status: 200 },
    );
}