"use client";

import { NotificationData } from "@/lib/types/notifications";
import { formatDateTime } from "@/lib/utils/format";

export default function NotificationList({
  notificationData,
}: {
  notificationData: NotificationData[];
}) {
  if (notificationData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-48 my-6 border-0 rounded-b-lg bg-gray-100">
        <p className="text-center text-xl max-md:text-lg font-semibold">
          No notifications
        </p>
        <p className="px-2 text-center text-sm">
          Return regularly to check for new notifications
        </p>
      </div>
    );
  }

  return (
    <ul className="w-full mt-6 mb-10">
      {notificationData.map((notification, idx) => {
        return (
          <li
            key={`notification_${idx}`}
            className="flex flex-row justify-between items-center border-t last:border-b w-full px-4 py-3 odd:bg-gray-100 even:bg-white"
          >
            <div className="flex flex-col w-3/4 whitespace-nowrap">
              <p className="font-semibold text-ellipsis overflow-hidden">
                {notification.title}
              </p>
              <p className="text-sm text-gray-500 text-ellipsis overflow-hidden">
                {notification.description}
              </p>
            </div>
            <p className="font-medium text-sm whitespace-nowrap text-ellipsis overflow-hidden">
              {notification.created_at
                ? formatDateTime(notification.created_at)
                : "--"}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
