"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/libs/utils/supabase";
import { AuthError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthFormState } from "@/libs/types/form-state";

const SignUpSchema = z.object({
    username: z.string().trim().min(6, { message: "Username must have at least 6 characters" }),
    email: z.string().trim().email({ message: "Please enter a valid email address" }),
    password: z.string().trim()
        .min(8, { message: "Password must have between 8 to 20 characters" })
        .max(20, { message: "Password must have between 8 to 20 characters" }),
});

const LoginSchema = SignUpSchema.omit({ username: true });

// Server action for the user to sign up for an account
export async function signUp(
    prevState: AuthFormState | undefined,
    formData: FormData,
) {
    try {
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");

        const validatedCredentials = SignUpSchema.safeParse({
            username,
            email,
            password,
        })
        if (!validatedCredentials.success) {
            return {
                error: validatedCredentials.error.flatten().fieldErrors,
                message: "Invalid field input(s)",
            }
        }

        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.signUp({
            email: email!.toString().trim(),
            password: password!.toString().trim(),
            options: {
                data: {
                    username: username!.toString().trim(),
                },
            },
        });
        if (error) throw error;
    } catch (error) {
        if (error instanceof AuthError) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

// Server action for logging in a user
export async function login(
    prevState: AuthFormState | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");

        const validatedCredentials = LoginSchema.safeParse({
            email,
            password,
        })
        if (!validatedCredentials.success) {
            return {
                error: validatedCredentials.error.flatten().fieldErrors,
                message: "Invalid login credentials",
            }
        }

        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email!.toString().trim(),
            password: password!.toString().trim(),
        });
        if (error) throw error;
    } catch (error) {
        if (error instanceof AuthError) {
            return { message: error.message };
        }
        return { message: "An error has occurred" };
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

// Server action for logging out a user
export async function logout() {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        if (error instanceof AuthError) {
            return { message: error.message };
        }
        else throw error;
    }

    redirect("/login");
}