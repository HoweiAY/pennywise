import { RouteHandlerResponse } from "@/lib/types/data";
import { UserData } from "@/lib/types/user";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<RouteHandlerResponse<UserData[]>>> {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const excludeCurrentUser = searchParams.get("excludeCurrentUser");

    const itemsLimit = limit && !isNaN(parseInt(limit)) ? Math.abs(parseInt(limit)) : 10;
    const itemsOffset = offset && !isNaN(parseInt(offset)) ? Math.abs(parseInt(offset)) : null;

    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("users")
        .select("user_id, username, email, first_name, last_name, country, avatar_url");
    if (searchQuery) {
        supabaseQuery = supabaseQuery.ilike("username", `%${searchQuery}%`);
    }
    if (itemsOffset) {
        supabaseQuery = supabaseQuery.range(itemsOffset, itemsOffset + itemsLimit - 1);
    }
    if (excludeCurrentUser === "true") {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({}, { status: 401, statusText: "User authentication failed" });
        }
        supabaseQuery = supabaseQuery.not("user_id", "eq", user.id);
    }
    supabaseQuery = supabaseQuery
        .order("username")
        .limit(itemsLimit);

    const { data: usersData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    return NextResponse.json(
        { data: usersData satisfies UserData[] ?? [] },
        { status: 200 },
    );
}