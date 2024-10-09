"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { PennyWiseLogo } from "./logo";
import avatarDefault from "@/ui/icons/avatar-default.png";
import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
    return (
        <div className="flex flex-row justify-end max-md:justify-between items-center h-20 ps-6 pe-12 py-6 max-md:px-6 border shadow-sm bg-white sticky top-0 z-0">
            <PennyWiseLogo hiddenOnLargeScreen={true} />
            <div className="flex flex-row justify-end items-center gap-6 max-md:gap-4">
                <Link 
                    href={"/dashboard/notifications"}
                    className="flex justify-center items-center rounded-full w-12 h-12 hover:bg-sky-100 text-gray-700 hover:text-blue-600 hover:shadow-sm duration-200"
                >
                    <BellIcon className="w-7 h-7" />
                </Link>
                <button
                    className="flex justify-center items-center border-2 border-gray-700 rounded-full w-12 h-12 overflow-hidden"
                    onClick={() => {}}
                >
                    <Image
                        priority
                        src={avatarDefault}
                        width={48}
                        height={48}
                        alt="Default user avatar"
                    />
                </button>
            </div>
        </div>
    )
}