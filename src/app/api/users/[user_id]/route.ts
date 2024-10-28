import { RouteHandlerResponse } from "@/lib/types/data";
import { UserData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<UserData>>> {
    const { user_id: userId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: userData, error } = await supabase
        .from("users")
        .select("username, email, first_name, last_name, country, avatar_url")
        .eq("user_id", userId)
        .limit(1);
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    if (userData.length === 0) {
        return NextResponse.json({}, { status: 404, statusText: "User not found" });
    }
    return NextResponse.json(
        { data: userData[0] as UserData },
        { status: 200 },
    );
}