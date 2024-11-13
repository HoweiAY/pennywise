"use client";

import { UserData } from "@/lib/types/user";
import avatarDefault from "@/ui/icons/avatar-default.png";
import Image from "next/image";
import Link from "next/link";

export default function ListItem({ userData }: { userData?: UserData }) {
    return (
        <Link
            href={"/dashboard/friends"}
            className="flex w-full h-full p-3"
        >
            <div className="flex shrink-0 items-center gap-2 w-2/3 max-lg:w-1/2 overflow-hidden">
                <div className="w-10 h-10 min-w-10 max-md:w-8 max-md:h-8 max-md:min-w-8 border-2 border-gray-700 rounded-full overflow-clip">
                    <Image
                        priority
                        loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                        src={userData?.avatar_url || avatarDefault.src}
                        width={40}
                        height={40}
                        alt={"User avatar"}
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                        {userData?.username || "username"}
                    </p>
                    <p className="whitespace-nowrap text-gray-500 text-sm max-md:text-xs text-ellipsis overflow-hidden">
                        {`${userData?.first_name || "Firstname"} ${userData?.last_name || "Lastname"}`}
                    </p>
                </div>
            </div>
        </Link>
    )
}