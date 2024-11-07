"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    EllipsisVerticalIcon,
    UserPlusIcon,
    NoSymbolIcon,
    UserMinusIcon,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export function MyProfileOptions() {
    return (
        <div className="flex flex-row max-md:justify-center items-center">
            <Link
                href={"/dashboard/profile/edit"}
                className="flex shrink-0 justify-center items-center gap-2 hover:border-blue-600 rounded-lg w-fit max-md:w-full h-12 max-md:h-10 px-6 text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            >
                <PencilSquareIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                Edit
            </Link>
        </div>
    )
}

export function FriendProfileOptions() {
    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <Link
                href={"/dashboard/transactions/new"}
                className="flex shrink-0 justify-center items-center hover:border-blue-600 rounded-lg w-fit max-md:w-full h-12 max-md:h-10 px-6 text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
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
                        <button className="w-full">
                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                <NoSymbolIcon className="w-4 h-4" />
                                <p>Block</p>
                            </DropdownMenuItem>
                        </button>
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
    )
}

export function UserProfileOptions() {
    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <button
                className="flex shrink-0 justify-center items-center gap-2 hover:border-blue-600 rounded-lg w-fit max-md:w-full h-12 max-md:h-10 px-6 text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            >
                <UserPlusIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                Invite
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                        <EllipsisVerticalIcon className="w-6 h-6" />
                    </button>
                </DropdownMenuTrigger>
                <AlertDialog>
                    <DropdownMenuContent>
                        <button className="w-full">
                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                <NoSymbolIcon className="w-4 h-4" />
                                <p>Block</p>
                            </DropdownMenuItem>
                        </button>
                    </DropdownMenuContent>
                </AlertDialog>
            </DropdownMenu>
        </div>
    )
}

export function PendingProfileOptions() {
    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:mx-3">
            <div className="flex flex-col lg:flex-row max-md:flex-row justify-center items-center gap-3 w-full">
                <button
                    className="flex justify-center items-center gap-1 border border-green-500 rounded-lg w-full h-12 max-lg:h-10 px-6 text-green-500 hover:text-white max-md:text-sm font-semibold bg-green-100 hover:bg-green-500 transition-colors duration-200"
                >
                    <CheckIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                    Accept
                </button>
                <button
                    className="flex justify-center items-center gap-1 border border-rose-600 rounded-lg w-full h-12 max-lg:h-10 px-6 text-rose-600 hover:text-white max-md:text-sm font-semibold bg-rose-100 hover:bg-rose-600 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                    Decline
                </button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                        <EllipsisVerticalIcon className="w-6 h-6" />
                    </button>
                </DropdownMenuTrigger>
                <AlertDialog>
                    <DropdownMenuContent>
                        <button className="w-full">
                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                <NoSymbolIcon className="w-4 h-4" />
                                <p>Block</p>
                            </DropdownMenuItem>
                        </button>
                    </DropdownMenuContent>
                </AlertDialog>
            </DropdownMenu>
        </div>
    )
}

export function InvitedProfileOptions() {
    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <button
                className="flex justify-center items-center border border-blue-500 hover:border-blue-600 rounded-lg w-28 max-md:w-full h-12 max-md:h-10 px-6 text-blue-500 hover:text-white max-md:text-sm font-semibold bg-sky-100 hover:bg-blue-600 after:content-['Pending'] hover:after:content-['Cancel'] focus:after:content-['Cancel']"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                        <EllipsisVerticalIcon className="w-6 h-6" />
                    </button>
                </DropdownMenuTrigger>
                <AlertDialog>
                    <DropdownMenuContent>
                        <button className="w-full">
                            <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                                <NoSymbolIcon className="w-4 h-4" />
                                <p>Block</p>
                            </DropdownMenuItem>
                        </button>
                    </DropdownMenuContent>
                </AlertDialog>
            </DropdownMenu>
        </div>
    )
}

export function BlockedProfileOptions() {
    return (
        <div>
            
        </div>
    )
}