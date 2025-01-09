import NotificationList from "@/components/dashboard/notifications/notification-list";
import { getAuthUser } from "@/lib/data/auth";
import { getUserNotifications } from "@/lib/data/notification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - PennyWise",
};

export default async function Notifications() {
  const { user } = await getAuthUser();
  const { status, message, data } = await getUserNotifications(user.id);
  if (status !== "success" || !data) {
    throw new Error(message || "Error fetching user notifications");
  }

  return (
    <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
      <div className="px-6">
        <h1 className="mt-8 mb-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          Notifications
        </h1>
        <NotificationList notificationData={data["notificationData"]} />
      </div>
    </main>
  );
}
