"use server";

import { createSupabaseServerClient } from "@/libs/utils/supabase";

export async function addUser() {
    const supabase = await createSupabaseServerClient();

}

export async function getUser() {
    const supabase = await createSupabaseServerClient();
}

export async function getAuthUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}