"use server";

import { z } from "zod";
import { ServerActionResponse } from "@/lib/types/action";
import { UserProfileFormState, UserProfileFormData } from "@/lib/types/form-state";
import { dataUrlToBlob } from "@/lib/utils/helper";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const UserProfileSchema = z.object({
    username: z.string().trim().min(6, { message: "Please enter a username with at least 6 characters" }),
    email: z.string().trim().email({ message: "Please enter a valid email address" }),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    country: z.string({ message: "Please select a country" }),
    spendingLimit: z.coerce.number().nullable(),
    avatarUrl: z.string().nullable(),
});

export async function updateUserProfile(
    prevState: UserProfileFormState |undefined,
    formData: FormData,
): Promise<UserProfileFormState | undefined> {
    try {
        const username = formData.get("username");
        const email = formData.get("email");
        const firstName = formData.get("first_name");
        const lastName = formData.get("last_name");
        const country = formData.get("country");
        const spendingLimit = formData.get("spending_limit");
        const avatarUrl = formData.get("avatar_url");

        const validatedProfileData = UserProfileSchema.safeParse({
            username,
            email,
            firstName,
            lastName,
            country,
            spendingLimit,
            avatarUrl,
        });
        if (!validatedProfileData.success) {
            return {
                error: validatedProfileData.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            };
        }

        const userProfileData: UserProfileFormData = {
            username: validatedProfileData.data.username,
            email: validatedProfileData.data.email,
            first_name: validatedProfileData.data.firstName,
            last_name: validatedProfileData.data.lastName,
            country: validatedProfileData.data.country,
            avatar_url: validatedProfileData.data.avatarUrl,
            updated_at: new Date().toISOString(),
        };
        userProfileData.spending_limit = validatedProfileData.data.spendingLimit
            ? Math.trunc(validatedProfileData.data.spendingLimit * 10 * 10)
            : null;

        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Error: user not found" };
        }
        const { error: supabaseError } = await supabase
            .from("users")
            .update(userProfileData)
            .eq("user_id", user.id);
        if (supabaseError) {
            return { message: supabaseError.message };
        }
        revalidatePath("/dashboard", "layout");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }
}

export async function updateUserAvatar(
    userId: string,
    avatarSrc: string,
): Promise<ServerActionResponse<string>> {
    try {
        const avatarBlob = dataUrlToBlob(avatarSrc);
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("User not found");
        }
        const avatarUrl = `${user.id}.${avatarBlob.type.split("/")[1]}`;
        const { data: avatarUploadData, error } = await supabase
            .storage
            .from("avatars")
            .upload(avatarUrl, avatarBlob, {
                cacheControl: "3600",
                upsert: true,
            });
        if (error) {
            return {
                status: "error",
                message: error.message,
            };
        }
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(avatarUploadData.path);
        return {
            status: "success",
            data: publicUrlData,
        };
    } catch (error) {
        let message = "Failed to upload user avatar";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            message,
        };
    }
}

// Server action for increasing users' balance amount
export async function addUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<ServerActionResponse<void>> {
    try {
        const supabase = supabaseClient ?? await createSupabaseServerClient();
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("balance")
            .eq("user_id", userId)
            .limit(1);
        if (userError) throw userError;
        let { balance: balanceInCents }: { balance: number } = userData[0];
        balanceInCents += amountInCents;
        const { error: updateError } = await supabase
            .from("users")
            .update({ balance: balanceInCents })
            .eq("user_id", userId);
        if (updateError) throw updateError;
        return { status: "success" };
    } catch (error) {
        let message = "Failed to add user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            message,
        };
    }
}

// Server action for deducting users' balance by a given amount
export async function deductUserBalance(
    userId: string,
    amountInCents: number,
    supabaseClient?: SupabaseClient,
): Promise<ServerActionResponse<void>> {
    try {
        const supabase = supabaseClient ?? await createSupabaseServerClient();
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("balance")
            .eq("user_id", userId)
            .limit(1);
        if (userError) throw userError;
        let { balance: balanceInCents }: { balance: number } = userData[0];
        if (balanceInCents < amountInCents) {
            return {
                status: "fail",
                message: "Deduction amount exceeds account balance",
            };
        }
        balanceInCents -= amountInCents;
        const { error: updateError } = await supabase
            .from("users")
            .update({ balance: balanceInCents })
            .eq("user_id", userId);
        if (updateError) throw updateError;
        return { status: "success" };
    } catch (error) {
        let message = "Failed to deduct user balance";
        if (error instanceof Error) {
            message = error.message;
        }
        return {
            status: "error",
            message,
        };
    }
}