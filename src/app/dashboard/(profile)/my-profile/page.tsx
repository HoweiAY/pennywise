import UserProfileCard from "@/components/dashboard/profile/user-profile-card";
import { UserData } from "@/lib/types/user";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataById } from "@/lib/data/user";

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
                        userProfileData={userProfileData}
                        type="my-profile"
                    />
                </section>
                <section>
                    
                </section>
            </div>
        </main>
    )
}