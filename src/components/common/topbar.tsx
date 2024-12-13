"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    BellIcon,
    UserIcon,
    Cog8ToothIcon,
    ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import avatarDefault from "@/ui/icons/avatar-default.png";
import { PennyWiseLogo } from "@/components/common/logo";
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/client";
import { logout } from "@/lib/actions/auth";
import { AuthError } from "@supabase/supabase-js";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function TopBar() {
    const [ avatarSrc, setAvatarSrc ] = useState<string | StaticImport | null>(avatarDefault.src);

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

    useEffect(() => {
        const getAvatarUrl = async () => {
            const supabase = await createSupabaseBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: userData, error } = await supabase
                    .from("users")
                    .select("avatar_url")
                    .eq("user_id", user.id)
                    .limit(1);
                if (!error && userData.length > 0) {
                    setAvatarSrc(userData[0].avatar_url);
                }
            }
        };
        getAvatarUrl();
    }, []);

    const [ error, dispatch ] = useFormState(handleLogout, undefined);

    return (
        <div className="flex flex-row justify-end max-md:justify-between items-center h-20 ps-6 pe-12 py-6 max-md:px-6 border border-gray-200 shadow-sm bg-sky-50 max-md:bg-white sticky top-0 z-20">
            <PennyWiseLogo hiddenOnLargeScreen={true} />
            <div className="flex flex-row justify-end items-center gap-6 max-md:gap-4">
                <Link 
                    href={"/dashboard/notifications"}
                    className="flex justify-center items-center rounded-full w-12 h-12 hover:bg-sky-200 max-md:hover:bg-sky-100 text-gray-700 hover:text-blue-600 hover:shadow-sm duration-200"
                >
                    <BellIcon className="w-7 h-7" />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex justify-center items-center border-2 border-gray-700 rounded-full w-12 h-12 overflow-hidden">
                            <Image
                                priority
                                loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                                src={avatarSrc || avatarDefault.src}
                                width={48}
                                height={48}
                                alt="User avatar"
                            />
                        </button>
                    </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel className="font-semibold">
                        My account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                    >
                        <Link
                            href={"/dashboard/my-profile"}
                            className="flex items-center gap-2 w-full"
                        >
                           <UserIcon /> View profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                        className="hover:cursor-pointer"
                    >
                        <Link
                            href={"/dashboard/settings"}
                            className="flex items-center gap-2 w-full"
                        >
                           <Cog8ToothIcon /> Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <form action={dispatch}>
                        <DropdownMenuItem>
                            <LogoutButton />
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="flex items-center gap-2 w-full text-rose-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={pending}
        >
            <ArrowLeftEndOnRectangleIcon /> Log out
        </button>
    );
}