"use server";

import { FriendFormState } from "@/lib/types/form-state";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { getFriendshipData } from "@/lib/data/friend";
import { revalidatePath } from "next/cache";

export async function inviteFriend(
    inviterId: string,
    inviteeId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (inviterId === inviteeId) {
            throw new Error("Inviter's and invitee's IDs cannot be identical");
        }
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from("friendships")
            .insert({
                inviter_id: inviterId,
                invitee_id: inviteeId,
                status: "pending",
            });
        if (error) {
            return { message: error.message };
        }
        revalidatePath("dashboard/friends");
        revalidatePath("/dashboard/profile/[username]", "page");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error adding friend invitation" };
    }
}

export async function acceptFriendInvite(
    inviterId: string,
    inviteeId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (inviterId === inviteeId) {
            throw new Error("Inviter's and invitee's IDs cannot be identical");
        }
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from("friendships")
            .update({
                status: "friend",
                updated_at: new Date().toISOString(),
            })
            .eq("inviter_id", inviterId)
            .eq("invitee_id", inviteeId);
        if (error) {
            return { message: error.message };
        }
        revalidatePath("dashboard/friends");
        revalidatePath("/dashboard/profile/[username]", "page");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error accepting friend invitation" };
    }
}

export async function declineFriendInvite(
    inviterId: string,
    inviteeId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (inviterId === inviteeId) {
            throw new Error("Inviter's and invitee's IDs cannot be identical");
        }
        const declineAction = await removeFriend(inviterId, inviteeId);
        if (declineAction) {
            throw new Error("Error declining friend invitation");
        }
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error declining friend invitation" };
    }
}

export async function cancelFriendInvite(
    inviterId: string,
    inviteeId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (inviterId === inviteeId) {
            throw new Error("Inviter's and invitee's IDs cannot be identical");
        }
        const declineAction = await removeFriend(inviterId, inviteeId);
        if (declineAction) {
            throw new Error("Error cancelling friend invitation");
        }
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error cancelling friend invitation" };
    }
}

export async function removeFriend(
    inviterId: string,
    inviteeId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (inviterId === inviteeId) {
            throw new Error("Inviter's and invitee's IDs cannot be identical");
        }
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from("friendships")
            .delete()
            .or(`and(inviter_id.eq.${inviterId},invitee_id.eq.${inviteeId}),and(inviter_id.eq.${inviteeId},invitee_id.eq.${inviterId})`);
        if (error) {
            return { message: error.message };
        }
        revalidatePath("dashboard/friends");
        revalidatePath("/dashboard/profile/[username]", "page");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error removing friend" };
    }
}

export async function blockUser(
    userId: string,
    blockedId: string,
): Promise<FriendFormState | undefined> {
    try {
        if (userId === blockedId) {
            throw new Error("User and blocked IDs cannot be identical");
        }
        const updateStatus: { [status: string]: string } = {
            status: "blocked",
            blocked_id: blockedId,
            updated_at: new Date().toISOString(),
        };
        const { status, data } = await getFriendshipData(userId, blockedId);

        const supabase = await createSupabaseServerClient();
        let supabaseQuery;
        if (status === "success" && data && data["friendshipData"].length !== 0) {
            updateStatus["inviter_id"] = data["friendshipData"][0].inviter_id;
            updateStatus["invitee_id"] = data["friendshipData"][0].invitee_id;
            supabaseQuery = supabase
                .from("friendships")
                .update(updateStatus)
                .or(`and(inviter_id.eq.${userId},invitee_id.eq.${blockedId}),and(inviter_id.eq.${blockedId},invitee_id.eq.${userId})`);
                ;
        } else {
            supabaseQuery = supabase
                .from("friendships")
                .insert({
                    inviter_id: userId,
                    invitee_id: blockedId,
                    status: "blocked",
                    blocked_id: blockedId,
                });
        }
        const { error } = await supabaseQuery;
        if (error) {
            return { message: error.message };
        }
        revalidatePath("dashboard/friends");
        revalidatePath("/dashboard/profile/[username]", "page");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "Error blocking user" };
    }
}