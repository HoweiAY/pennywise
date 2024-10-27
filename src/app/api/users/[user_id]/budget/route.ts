import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { BudgetFormData } from "@/lib/types/form-state";
import { NextRequest, NextResponse } from "next/server";
import { RouteHandlerResponse } from "@/lib/types/data";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<BudgetFormData[]>>> {
    const { user_id: userId } = await params;
    if (!userId) {
        return NextResponse.json({}, { status: 400, statusText: "User ID is missing" });
    }
    const supabase = await createSupabaseServerClient();
    const { data: userBudgetData, error } = await supabase
        .from("budgets")
        .select("budget_id, name, category_id, currency, amount, user_id, description")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(12);
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    return NextResponse.json(
        { data: userBudgetData as BudgetFormData[] },
        { status: 200 },
    );
}