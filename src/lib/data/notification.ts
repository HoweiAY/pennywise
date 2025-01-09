import { DataResponse } from "@/lib/types/data";
import { NotificationData } from "@/lib/types/notifications";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getUserNotifications(
  userId: string,
  limit?: number
): Promise<DataResponse<NotificationData[]>> {
  noStore();

  const supabase = await createSupabaseServerClient();
  let supabaseQuery = supabase
    .from("notifications")
    .select(
      `
      notification_id,
      type,
      title,
      description,
      status,
      from_user_id,
      target_user_id,
      friendship_invitee_id,
      friendship_inviter_id,
      transaction_id,
      created_at
    `
    )
    .eq("target_user_id", userId);
  if (limit) {
    supabaseQuery = supabaseQuery.limit(limit);
  }
  const { data, error } = await supabaseQuery;
  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
  return {
    status: "success",
    data: { notificationData: data satisfies NotificationData[] },
  };
}
