import UserSettingsForm from "@/components/dashboard/settings/user-settings-form";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataById, getUserBalanceData } from "@/lib/data/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - PennyWise",
};

export default async function Settings() {
  const { user } = await getAuthUser();
  const [
    { status: userDataStatus, message: userDataMessage, data: userData },
    {
      status: userBalanceDataStatus,
      message: userBalanceDataMessage,
      data: userBalanceData,
    },
  ] = await Promise.all([
    getUserDataById(user.id),
    getUserBalanceData(user.id),
  ]);
  if (userDataStatus !== "success" || !userData) {
    throw new Error(userDataMessage || "Failed to fetch user data");
  }
  if (userBalanceDataStatus !== "success" || !userBalanceData) {
    throw new Error(
      userBalanceDataMessage || "Failed to fetch user balance data"
    );
  }

  return (
    <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
      <div className="px-6">
        <header>
          <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
            Settings
          </h1>
          <p className="mt-1 md:me-4 max-md:my-1 max-md:text-sm text-gray-500">
            Manage and edit your profile settings and information
          </p>
        </header>
        <UserSettingsForm
          userId={user.id}
          userData={userData["userData"]}
          userBalanceData={userBalanceData["userBalanceData"]}
        />
      </div>
    </main>
  );
}
