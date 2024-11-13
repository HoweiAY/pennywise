"use client";

import ListItem from "@/components/dashboard/friends/list-item";
import {
    MyProfileOptions,
    FriendProfileOptions,
    UserProfileOptions,
    PendingProfileOptions,
    InvitedProfileOptions,
    BlockedProfileOptions,
} from "@/components/dashboard/profile/profile-options";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EllipsisVerticalIcon, UserCircleIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { UserData } from "@/lib/types/user";
import Link from "next/link";

export function FriendList({
    length,
    infiniteScroll,
}: {
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {Array.from({ length: length ?? 5 }).map((_, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem />
                        <div className="absolute bottom-5 right-6 max-md:bottom-4 max-md:right-4 flex flex-row justify-between items-center gap-2">
                            <Link
                                href={"/dashboard/transactions/new"}
                                className="flex justify-center items-center border border-blue-500 hover:border-blue-600 rounded-lg w-fit h-10 max-md:h-8 px-6 max-md:px-4 text-blue-500 hover:text-white max-md:text-sm font-semibold bg-sky-100 hover:bg-blue-600 transition-colors duration-200"
                            >
                                Pay friend
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                                        <EllipsisVerticalIcon className="w-6 h-6" />
                                    </button>
                                </DropdownMenuTrigger>
                                <AlertDialog>
                                    <DropdownMenuContent>
                                        <Link href={`/dashboard`}>
                                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                                <UserCircleIcon className="w-4 h-4" />
                                                <p>View profile</p>
                                            </DropdownMenuItem>
                                        </Link>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                                <UserMinusIcon className="w-4 h-4 text-rose-600" />
                                                <p className="text-rose-600">Remove</p>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </AlertDialog>
                            </DropdownMenu>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export function UserList({
    users,
    length,
    infiniteScroll,
}: {
    users: UserData[],
    length?: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full pt-4 max-md:pt-3">
            {users.map((userData, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <ListItem userData={userData} />
                        <div className="absolute right-6 bottom-4 max-md:bottom-3 max-md:right-4">
                            <FriendProfileOptions />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}