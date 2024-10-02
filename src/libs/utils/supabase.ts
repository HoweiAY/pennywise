import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase browser client
export async function createSupabaseBrowserClient() {
    const supabase = createBrowserClient(
        supabaseUrl,
        supabaseKey,
    );
    return supabase;
}

// Supabase server-side client
export async function createSupabaseServerClient() {
    const cookieStore = cookies()

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        throw new Error("Error setting cookies");
                    }
                },
            },
        }
    );

    return supabase;
}