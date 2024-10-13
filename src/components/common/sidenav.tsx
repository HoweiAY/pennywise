"use client";

import {
    Bars4Icon,
    HomeIcon,
    ArrowsRightLeftIcon,
    ChartPieIcon,
    BellIcon,
    Cog8ToothIcon,
    ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { PennyWiseLogo } from "./logo";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { AuthError } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";

const navLinks = [
    { name: "Home", href: "/dashboard", urlRegex: /\/dashboard$/g, icon: HomeIcon },
    { name: "Transactions", href: "/dashboard/transactions", urlRegex: /\/dashboard\/transactions[\/.]*/g, icon: ArrowsRightLeftIcon },
    { name: "Budget", href: "/dashboard/budget", urlRegex: /\/dashboard\/budget[\/.]*/g, icon: ChartPieIcon },
    { name: "Notifications", href: "/dashboard/notifications", urlRegex: /\/dashboard\/notifications[\/.]*/g, icon: BellIcon },
];

export default function SideNav() {
    const pathname = usePathname();
    const [ collapsed, setCollapsed ] = useState<boolean>(false);

    const handleLogout = async (
        prevState: { message: string } | undefined,
        formData: FormData,
    ) => {
        try {
            await logout();
        } catch (error) {
            return { message: error instanceof AuthError ? error.message : "Error logging out user" };
        }
    };

    const [ error, dispatch ] = useFormState(handleLogout, undefined);

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
            <nav className="row-span-4 flex flex-col min-h-60 px-4 overflow-scroll no-scrollbar">
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
                                        { "bg-sky-100 text-blue-600 font-semibold": pathname.match(link.urlRegex) },
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
            <div className="relative row-span-2 flex flex-col justify-end gap-1 w-full min-h-20 px-4 py-8 space-x-0 space-y-2">
                <div className="absolute -top-12 left-0 w-full h-12 bg-gradient-to-t from-stone-100 to-transparent" />
                <Link
                    href={"/dashboard/settings"}
                    className={`flex flex-none items-center rounded-md gap-3 w-full h-[42px] ${collapsed ? "w-[48px] max-w-[48px]" : "max-w-full"} p-3 bg-gray-50 hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 overflow-hidden text-nowrap duration-200`}
                >
                    <Cog8ToothIcon className="w-6 min-w-6" />
                    <span className={`${collapsed ? "opacity-0" : "opacity-100"} text-sm font-medium`}>Settings</span>
                </Link>
                <form
                    action={dispatch}
                    className="w-full"
                >
                    <LogoutButton collapsed={collapsed} />
                </form>
            </div>
        </aside>
    )
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button 
            className={`flex flex-none items-center rounded-md gap-3 w-full h-[42px] ${collapsed ? "w-[48px] max-w-[48px]" : "max-w-full"} p-3 bg-gray-50 hover:bg-rose-600 text-rose-600 hover:text-white text-nowrap shadow-md shadow-slate-300 overflow-hidden aria-disabled:cursor-not-allowed aria-disabled:opacity-50 duration-200`}
            aria-disabled={pending}
        >
            <ArrowLeftEndOnRectangleIcon className="w-6 min-w-6" />
            <span className={`${collapsed ? "opacity-0" : "opacity-100"} text-sm font-medium`}>Log out</span>
        </button>
    )
}