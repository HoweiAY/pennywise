import UserProfileCard from "@/components/dashboard/profile/user-profile-card";
import { UserData } from "@/lib/types/user";
import { FrinedshipTypes } from "@/lib/types/friend";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataByUsername } from "@/lib/data/user";
import { getFriendshipData } from "@/lib/data/friend";

export default async function UserProfile({ params }: { params: { username: string } }) {
    const [
        { user },
        { status: userDataStatus, message: userDataMessage, data: userData },
    ] = await Promise.all([
        getAuthUser(),
        getUserDataByUsername(params.username),
    ]);
    if (userDataStatus !== "success" || !userData) {
        throw new Error(userDataMessage || "Error fetching user profile");
    }
    const userProfileData = userData["userData"] satisfies UserData;

    const {
        status: frienshipDataStatus,
        message: frienshipDataMessage,
        data: frienshipData,
    } = await getFriendshipData(user.id, userProfileData.user_id!);
    if (frienshipDataStatus !== "success" || !frienshipData) {
        throw new Error(frienshipDataMessage || "Error fetching user relationship data");
    }
    const type = frienshipData["friendshipData"].length === 0 ? "user" : frienshipData["friendshipData"][0].status as FrinedshipTypes;
    
    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    User profile
                </h1>
                <section className="w-full my-6">
                    <UserProfileCard
                        userProfileData={userProfileData}
                        type={type}
                    />
                </section>
            </div>
        </main>
    )
}