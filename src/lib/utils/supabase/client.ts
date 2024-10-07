import { createBrowserClient } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase browser client
export async function createSupabaseBrowserClient() {
    const supabase = createBrowserClient(
        supabaseUrl,
        supabaseKey,
    );
    return supabase;
};