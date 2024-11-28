import { DataResponse } from "@/lib/types/data";
import { FriendshipData, FriendsData, FriendshipType } from "@/lib/types/friend";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getFriendshipData(userId: string, friendId: string): Promise<DataResponse<FriendshipData[]>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: friendshipData, error } = await supabase
        .from("friendships")
        .select("inviter_id, invitee_id, status, blocked_id")
        .or(`and(inviter_id.eq.${userId},invitee_id.eq.${friendId}),and(inviter_id.eq.${friendId},invitee_id.eq.${userId})`);
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { friendshipData: friendshipData satisfies FriendshipData[] },
    };
}

export async function getUserFriends(
    userId: string,
    status?: FriendshipType | "invited",
    limit?: number,
): Promise<DataResponse<FriendsData[]>> {
    noStore();

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
    if (limit) {
        supabaseQuery = supabaseQuery.limit(limit);
    }
    supabaseQuery = supabaseQuery.order("username", { referencedTable: "users" });
    const { data: friendsData, error } = await supabaseQuery;
    if (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
    return {
        status: "success",
        data: { userFriendsData: friendsData as FriendsData[] },
    };
}