import { RouteHandlerResponse } from "@/lib/types/data";
import { UserBalanceData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<UserBalanceData>>> {
    const { user_id: userId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: userBalanceData, error } = await supabase
        .from("users")
        .select("currency, balance, spending_limit")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    if (userBalanceData.length === 0) {
        return NextResponse.json({}, { status: 404, statusText: "User balance information not found" });
    }
    return NextResponse.json(
        { data: userBalanceData[0] as UserBalanceData },
        { status: 200 },
    );
}