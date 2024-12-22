import { RouteHandlerResponse } from "@/lib/types/data";
import { FriendsData } from "@/lib/types/friend";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ user_id: string }> },
): Promise<NextResponse<RouteHandlerResponse<FriendsData[]>>> {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const { user_id: userId } = await params;

    const itemsLimit = limit && !isNaN(parseInt(limit)) ? Math.abs(parseInt(limit)) : 10;
    const itemsOffset = offset && !isNaN(parseInt(offset)) ? Math.abs(parseInt(offset)) : null;

    const supabase = await createSupabaseServerClient();
    let supabaseQuery = supabase
        .from("friendships")
        .select(`
            inviter_id,
            invitee_id,
            status,
            blocked_id,
            inviter_data:users!friendships_inviter_id_fkey(username, first_name, last_name, email, avatar_url),
            invitee_data:users!friendships_invitee_id_fkey(username, first_name, last_name, email, avatar_url)
        `);
    if (!status) {
        supabaseQuery = supabaseQuery.or(`inviter_id.eq.${userId}, invitee_id.eq.${userId}`);
    } else {
        if (status === "pending") {
            supabaseQuery = supabaseQuery.eq("invitee_id", userId);
        } else if (status === "invited") {
            supabaseQuery = supabaseQuery.eq("inviter_id", userId);
        } else {
            supabaseQuery = supabaseQuery.or(`inviter_id.eq.${userId}, invitee_id.eq.${userId}`);
        }
        supabaseQuery = supabaseQuery.eq("status", status === "invited" ? "pending" : status);
    }
    if (itemsOffset) {
        supabaseQuery = supabaseQuery.range(itemsOffset, itemsOffset + itemsLimit - 1);
    }
    if (limit && !isNaN(parseInt(limit))) {
        supabaseQuery = supabaseQuery.limit(parseInt(limit));
    }
    supabaseQuery = supabaseQuery.order("username", { referencedTable: "users" });
    const { data: friendsData, error } = await supabaseQuery;
    if (error) {
        return NextResponse.json({}, { status: 500, statusText: error.message });
    }
    return NextResponse.json(
        { data: friendsData as FriendsData[] },
        { status: 200 },
    );
}