"use client";

import {
    Bars4Icon,
    HomeIcon,
    ArrowsRightLeftIcon,
    BellIcon,
    Cog8ToothIcon,
    ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { PennyWiseLogo } from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const navLinks = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    { name: "Transactions", href: "/dashboard/transactions", icon: ArrowsRightLeftIcon },
    { name: "Notifications", href: "/dashboard/notifications", icon: BellIcon },
];

export default function SideNav() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <aside
            className={clsx(
                "flex-none grid grid-cols-1 grid-rows-4 align-top border-r border-gray-200 w-64 h-full min-h-[30rem] bg-stone-100 shadow-xl max-md:hidden duration-200",
                { "md:w-24": collapsed },
            )}
        >
            <div className="row-span-1 flex flex-row justify-start items-center gap-2 min-h-20 px-3 py-4 bg-gray-200">
                <PennyWiseLogo hiddenOnLargeScreen={false} />
                <h1
                    className={clsx(
                        "inline-block ml-2 text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 via-purple-700 to-pink-500 duration-75",
                        { "opacity-0": collapsed },
                    )}
                >PennyWise</h1>
            </div>
            <nav className="row-span-4 flex flex-col min-h-60 px-4 overflow-scroll">
                <button
                    className={clsx(
                        "flex flex-none items-center gap-2 rounded-md w-[48px] h-[42px] px-3 py-2 my-4 bg-gray-50 hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200",
                        { "after:content-['Menu'] after:ml-4 after:font-semibold after:text-black": !collapsed },
                    )}
                    onClick={() => { setCollapsed(prev => !prev) }}
                >
                    <Bars4Icon className="w-6 min-w-6" />
                </button>
                <ul className="flex flex-col justify-center gap-1 w-full space-x-0 space-y-2" >
                    {navLinks.map(link => {
                        const LinkIcon = link.icon;
                        return (
                            <li
                                className={`flex items-center rounded-md w-full h-[42px] ${collapsed ? "w-[48px] max-w-[48px]" : "max-w-full"} shadow-md shadow-slate-300 overflow-hidden duration-200`}
                                key={link.name.toLowerCase()}
                            >
                                <Link
                                    href={link.href}
                                    className={clsx(
                                        "flex flex-none justify-start items-center gap-3 w-full h-[42px] p-3 bg-gray-50 hover:bg-sky-100 hover:text-blue-600 font-medium duration-200",
                                        { "bg-sky-100 text-blue-600 font-semibold": pathname === link.href },
                                    )}
                                >
                                    <LinkIcon className="w-6 min-w-6" />
                                    <span className={`${collapsed ? "opacity-0" : "opacity-100"} text-sm`}>{link.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <div className="row-span-2 flex flex-col justify-end gap-1 w-full min-h-20 px-4 py-8 space-x-0 space-y-2">
                <Link
                    href={"/dashboard/settings"}
                    className={`flex flex-none items-center rounded-md gap-3 w-full h-[42px] ${collapsed ? "w-[48px] max-w-[48px]" : "max-w-full"} p-3 bg-gray-50 hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 overflow-hidden text-nowrap duration-200`}
                >
                    <Cog8ToothIcon className="w-6 min-w-6" />
                    <span className={`${collapsed ? "opacity-0" : "opacity-100"} text-sm font-medium`}>Settings</span>
                </Link>
                <button
                    className={`flex flex-none items-center rounded-md gap-3 w-full h-[42px] ${collapsed ? "w-[48px] max-w-[48px]" : "max-w-full"} p-3 bg-gray-50 hover:bg-rose-600 text-rose-600 hover:text-white text-nowrap shadow-md shadow-slate-300 overflow-hidden duration-200`}
                    onClick={() => { }}
                >
                    <ArrowLeftEndOnRectangleIcon className="w-6 min-w-6" />
                    <span className={`${collapsed ? "opacity-0" : "opacity-100"} text-sm font-medium`}>Log out</span>
                </button>
            </div>
        </aside>
    )
}