"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import avatarDefault from "@/ui/icons/avatar-default.png";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EllipsisVerticalIcon, UserCircleIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function FriendsList({
    length,
    infiniteScroll,
}: {
    length: number,
    infiniteScroll?: boolean,
}) {
    return (
        <ul className="flex flex-col items-center gap-3 w-full">
            {Array.from({ length: 3 }).map((_, idx) => {
                return (
                    <li
                        key={`friend_${idx}`}
                        className="relative border border-slate-100 rounded-xl w-full h-24 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
                    >
                        <FriendsListItem />
                        <div className="absolute bottom-7 right-6 max-md:right-4 flex flex-row justify-between items-center gap-2">
                            <Link
                                href={"/dashboard/transactions/new"}
                                className="flex justify-center items-center border border-blue-500 hover:border-blue-600 rounded-lg w-fit h-10 px-6 max-md:px-4 text-blue-500 hover:text-white max-md:text-sm font-semibold bg-sky-100 hover:bg-blue-600 transition-colors duration-200"
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

function FriendsListItem() {
    return (
        <Link
            href={"/dashboard/friends"}
            className="flex w-full h-full p-3"
        >
            <div className="flex shrink-0 items-center gap-2 w-2/3 max-lg:w-1/2 overflow-hidden">
                <div className="w-10 h-10 min-w-10 border-2 border-gray-700 rounded-full">
                    <Image
                        priority
                        loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                        src={avatarDefault.src}
                        width={40}
                        height={40}
                        alt={"User avatar"}
                    />
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                        username
                    </p>
                    <p className="whitespace-nowrap text-sm text-ellipsis overflow-hidden">
                        Firstname Lastname
                    </p>
                </div>
            </div>
        </Link>
    )
}