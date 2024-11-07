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
import Image from "next/image";
import { useCallback } from "react";

export default function UserProfileCard({
    type,
}: {
    type: "my-profile" | "friend" | "user" | "pending" | "invited" | "blocked",
}) {
    const showUserProfile = useCallback(() => {
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
                <div className="w-20 h-20 min-w-20 border-2 border-gray-700 rounded-full">
                    <Image
                        priority
                        loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                        src={avatarDefault.src}
                        width={80}
                        height={80}
                        alt={"User avatar"}
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="whitespace-nowrap font-semibold text-xl text-ellipsis overflow-hidden">
                        username
                    </p>
                    <p className="whitespace-nowrap text-gray-500 text-ellipsis overflow-hidden">
                        Firstname Lastname
                    </p>
                    <p className="whitespace-nowrap text-sm text-gray-800 text-ellipsis overflow-hidden">
                        Sweden
                    </p>
                </div>
            </div>
            {showUserProfile()}
        </div>
    )
}