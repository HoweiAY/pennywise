import { DataResponse } from "@/lib/types/data";
import { FriendshipData } from "@/lib/types/friend";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getFriendshipData(userId: string, frinedId: string): Promise<DataResponse<FriendshipData[]>> {
    noStore();

    const supabase = await createSupabaseServerClient();
    const { data: friendshipData, error } = await supabase
        .from("friendships")
        .select("inviter_id, invitee_id, status, blocked_id")
        .or(`and(inviter_id.eq.${userId},invitee_id.eq.${frinedId}),and(inviter_id.eq.${frinedId},invitee_id.eq.${userId})`);
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