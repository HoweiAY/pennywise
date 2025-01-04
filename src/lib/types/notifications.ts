export type NotificationType = "friend" | "transaction";

export type NotificationStatus = "unread" | "read";

export type NotificationData = {
  notification_id?: string,
  type: NotificationType,
  title: string,
  description: string,
  status: NotificationStatus,
  from_user_id: string | null,
  target_user_id: string,
  friendship_invitee_id?: string | null,
  friendship_inviter_id?: string | null,
  transaction_id?: string | null,
  created_at?: string | null,
};