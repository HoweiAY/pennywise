"use server";

import { ServerActionResponse } from "@/lib/types/action";
import {
  NotificationData,
  NotificationStatus,
} from "@/lib/types/notifications";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  notificationData: NotificationData,
  supabaseClient?: SupabaseClient
): Promise<ServerActionResponse<void>> {
  try {
    const supabase = supabaseClient ?? (await createSupabaseServerClient());
    const { error } = await supabase
      .from("notifications")
      .insert(notificationData);
    if (error) throw error;
    return { status: "success" };
  } catch (error) {
    let message = "Failed to create notification";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: "error",
      message: message,
    };
  }
}

export async function updateNotificationStatus(
  notificationId: string,
  status: NotificationStatus,
  supabaseClient?: SupabaseClient
): Promise<ServerActionResponse<void>> {
  try {
    const supabase = supabaseClient ?? (await createSupabaseServerClient());
    const { error } = await supabase
      .from("notifications")
      .update({ status })
      .eq("notification_id", notificationId);
    if (error) throw error;
    return { status: "success" };
  } catch (error) {
    let message = "Failed to update notification status";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: "error",
      message: message,
    };
  }
}

export async function clearNotifications(
  userId: string
): Promise<ServerActionResponse<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("target_user_id", userId);
    if (error) throw error;
    return { status: "success" };
  } catch (error) {
    let message = "Failed to clear user notifications";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: "error",
      message: message,
    };
  }
}

export async function clearNotificationById(
  notificationId: string
): Promise<ServerActionResponse<void>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("notification_id", notificationId);
    if (error) throw error;
    return { status: "success" };
  } catch (error) {
    let message = "Failed to clear notification";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      status: "error",
      message: message,
    };
  }
}
