import { BudgetFormData } from "@/lib/types/form-state";
import { BudgetItem } from "@/lib/types/budget";
import { RouteHandlerResponse } from "@/lib/types/data";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ budget_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<BudgetFormData | BudgetItem>>> {
    const searchParams = request.nextUrl.searchParams;
    const asForm = searchParams.get("asForm");
    const { budget_id: budgetId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: budgetData, error } = await supabase
        .from("budgets")
        .select("name, category_id, currency, amount, user_id, description")
        .eq("budget_id", budgetId)
        .limit(1);
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    if (budgetData.length === 0) {
        return NextResponse.json({}, { status: 404, statusText: "Budget not found" });
    }
    return NextResponse.json(
        { data: asForm
            ? budgetData[0] as BudgetFormData
            : budgetData[0] as BudgetItem
        },
        { status: 200 },
    );
}