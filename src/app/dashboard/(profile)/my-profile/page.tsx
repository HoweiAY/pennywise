import UserProfileCard from "@/components/dashboard/profile/user-profile-card";
import MyActivitiesList from "@/components/dashboard/profile/my-activities-list";
import ProfileActivitiesListSkeleton from "@/ui/skeletons/profile-activities-list-skeleton";
import { UserData } from "@/lib/types/user";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataById } from "@/lib/data/user";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile - PennyWise",
};

export default async function MyProfile() {
    const { user } = await getAuthUser();
    const {
        status: userDataStatus,
        message: userDataMessage,
        data: userData,
    } = await getUserDataById(user.id);
    if (userDataStatus !== "success" || !userData) {
        throw new Error(userDataMessage || "Error fetching user profile");
    }
    const userProfileData = userData["userData"] satisfies UserData;

    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    My profile
                </h1>
                <section className="w-full my-6">
                    <UserProfileCard
                        currUserId={user.id}
                        userProfileData={userProfileData}
                        type="my-profile"
                    />
                </section>
                <section>
                    <h2 className="text-2xl max-md:text-xl font-semibold">
                        My Activities
                    </h2>
                    <Suspense fallback={<ProfileActivitiesListSkeleton />}>
                        <MyActivitiesList userId={user.id} />
                    </Suspense>
                </section>
            </div>
        </main>
    )
}