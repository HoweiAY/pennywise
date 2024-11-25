import UserProfileCard from "@/components/dashboard/profile/user-profile-card";
import { UserData } from "@/lib/types/user";
import { FrinedshipStatus } from "@/lib/types/friend";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataByUsername } from "@/lib/data/user";
import { getFriendshipData } from "@/lib/data/friend";

export default async function UserProfile({ params }: { params: { username: string } }) {
    const targetUsername = decodeURIComponent(params.username);
    const [
        { user },
        { status: userDataStatus, message: userDataMessage, data: userData },
    ] = await Promise.all([
        getAuthUser(),
        getUserDataByUsername(targetUsername),
    ]);
    if (userDataStatus !== "success" || !userData) {
        throw new Error(userDataMessage || "Error fetching user profile");
    }
    if (!userData["userData"]) {
        throw new Error("User profile not found");
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
    let type: FrinedshipStatus = frienshipData["friendshipData"].length === 0 ? "user" : frienshipData["friendshipData"][0].status;
    if (type === "pending" && frienshipData["friendshipData"][0].inviter_id === user.id) {
        type = "invited";
    }

    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    User profile
                </h1>
                <section className="w-full my-6">
                    <UserProfileCard
                        currUserId={user.id}
                        userProfileData={userProfileData}
                        type={type}
                        friendshipData={frienshipData["friendshipData"][0]}
                    />
                </section>
                <section>
                    <h2 className="text-2xl max-md:text-xl font-semibold">
                        Latest Activities
                    </h2>
                    {type !== "friend" &&
                        <div className="flex flex-col justify-center items-center w-full h-48 my-6 border-0 rounded-xl bg-gray-100">
                            <p className="text-center text-xl max-md:text-lg font-semibold">
                                No activities
                            </p>
                            <p className="px-2 text-center text-sm">
                                Invite {userProfileData.username} to start interacting with them
                            </p>
                        </div>
                    }
                </section>
            </div>
        </main>
    )
}