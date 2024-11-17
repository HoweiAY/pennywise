"use server";

import { FriendFormState } from "@/lib/types/form-state";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
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
            .update({ status: "friend" })
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