"use client";

import {
    MyProfileOptions,
    FriendProfileOptions,
    UserProfileOptions,
    PendingProfileOptions,
    InvitedProfileOptions,
    BlockedProfileOptions,
} from "@/components/dashboard/profile/profile-options";
import avatarDefault from "@/ui/icons/avatar-default.png";
import { UserData } from "@/lib/types/user";
import { FrinedshipTypes } from "@/lib/types/friend";
import { countryCodes } from "@/lib/utils/constant";
import Image from "next/image";
import { useCallback } from "react";

export default function UserProfileCard({
    userProfileData,
    type,
}: {
    userProfileData: UserData,
    type: "my-profile" | FrinedshipTypes,
}) {
    const showProfileOptions = useCallback(() => {
        switch (type) {
            case "my-profile":
                return <MyProfileOptions />;
            case "friend":
                return <FriendProfileOptions />;
            case "user":
                return <UserProfileOptions />;
            case "pending":
                return <PendingProfileOptions />;
            case "invited":
                return <InvitedProfileOptions />;
            case "blocked":
                return <BlockedProfileOptions />;
            default:
                return <></>;
        }
    }, [type]);

    return (
        <div className="flex flex-row max-md:flex-col md:justify-between md:items-center max-md:gap-6 border border-slate-100 rounded-lg w-full px-6 py-10 max-md:py-6 bg-white shadow-md">
            <div className="flex flex-row items-center gap-3 md:w-1/2">
                <div className="w-20 h-20 min-w-20 border-2 border-gray-700 rounded-full overflow-clip">
                    <Image
                        priority
                        loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                        src={userProfileData.avatar_url || avatarDefault.src}
                        width={80}
                        height={80}
                        alt={"User avatar"}
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="whitespace-nowrap font-semibold text-xl text-ellipsis overflow-hidden">
                        {userProfileData.username}
                    </p>
                    <p className="whitespace-nowrap text-gray-500 text-ellipsis overflow-hidden">
                        {userProfileData.first_name && userProfileData.last_name
                            ? `${userProfileData.first_name} ${userProfileData.last_name}`
                            : `${userProfileData.email}`
                        }
                    </p>
                    <p className="whitespace-nowrap text-sm text-gray-800 text-ellipsis overflow-hidden">
                        {userProfileData.country ? countryCodes[userProfileData.country as keyof typeof countryCodes] : "--"}
                    </p>
                </div>
            </div>
            {showProfileOptions()}
        </div>
    )
}