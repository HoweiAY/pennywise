"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import {
    EllipsisVerticalIcon,
    UserPlusIcon,
    NoSymbolIcon,
    UserMinusIcon,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    inviteFriend,
    acceptFriendInvite,
    declineFriendInvite,
    cancelFriendInvite,
} from "@/lib/actions/friend";
import { UserData } from "@/lib/types/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

export function MyProfileOptions() {
    return (
        <div className="flex flex-row max-md:justify-center items-center">
            <Link
                href={"/dashboard/my-profile/edit"}
                className="flex shrink-0 justify-center items-center gap-2 hover:border-blue-600 rounded-lg w-fit max-md:w-full h-12 max-md:h-10 px-6 text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            >
                <PencilSquareIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                Edit
            </Link>
        </div>
    )
}

export function FriendProfileOptions({
    currUserId,
    targetUserId,
}: {
    currUserId: string,
    targetUserId: string,
}) {
    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <Link
                href={`/dashboard/transactions/new?transactionType=pay_friend&friendId=${targetUserId}`}
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

export function UserProfileOptions({
    currUserId,
    targetUserId,
}: {
    currUserId: string,
    targetUserId: string,
}) {
    const [ processingInvitation, setProcessingInvitation ] = useState<boolean>(false);
    const [ isPending, startTransition ] = useTransition();
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleInviteFriend = useCallback(async () => {
        setProcessingInvitation(true);
        const error = await inviteFriend(currUserId, targetUserId);
        if (error) {
            toast({
                variant: "destructive",
                title: "Invitation failed",
                description: "An error has occurred while sending an invitation.",
                action: (
                    <ToastAction altText="Try again" onClick={handleInviteFriend}>
                        Try again
                    </ToastAction>
                )
            });
            console.error(error.message);
        } else {
            startTransition(refresh);
            toast({
                title: "Invitation sent!",
                description: "Your friend invitation has been sent successfully.",
            });
        }
        setProcessingInvitation(false);
    }, [currUserId, targetUserId]);

    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <button
                className="flex shrink-0 justify-center items-center gap-2 hover:border-blue-600 rounded-lg w-fit max-md:w-full h-12 max-md:h-10 px-6 text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                onClick={handleInviteFriend}
                aria-disabled={processingInvitation || isPending}
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

export function PendingProfileOptions({
    currUserId,
    targetUserId,
}: {
    currUserId: string,
    targetUserId: string,
}) {
    const [ processingSelection, setProcessingSelection ] = useState<boolean>(false);
    const [ isPending, startTransition ] = useTransition();
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleSelectInviteOption = useCallback(async (action: "accept" | "decline") => {
        setProcessingSelection(true);
        const error = await (action === "accept"
            ? acceptFriendInvite(targetUserId, currUserId)
            : declineFriendInvite(targetUserId, currUserId)
        );
        if (error) {
            toast({
                variant: "destructive",
                title: "Action failed",
                description: `An error has occurred while ${action === "accept" ? "accepting" : "declining"} the invitation.`,
                action: (
                    <ToastAction altText="Try again" onClick={async () => await handleSelectInviteOption(action)}>
                        Try again
                    </ToastAction>
                )
            });
            console.error(error.message);
        } else {
            startTransition(refresh);
            if (action === "accept") {
                toast({
                    title: "Invitation accepted!",
                    description: `You and ${targetUserId} are now friends.`,
                });
            }
        }
        setProcessingSelection(false);
    }, [currUserId, targetUserId]);

    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:mx-3">
            <div className="flex flex-col lg:flex-row max-md:flex-row justify-center items-center gap-3 w-full">
                <button
                    className="flex justify-center items-center gap-1 border border-green-500 rounded-lg w-full h-12 max-lg:h-10 px-6 text-green-500 hover:text-white max-md:text-sm font-semibold bg-green-100 hover:bg-green-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                    onClick={async () => await handleSelectInviteOption("accept")}
                    aria-disabled={processingSelection || isPending}
                >
                    <CheckIcon className="w-6 h-6 max-md:w-5 max-md:h-5" />
                    Accept
                </button>
                <button
                    className="flex justify-center items-center gap-1 border border-rose-600 rounded-lg w-full h-12 max-lg:h-10 px-6 text-rose-600 hover:text-white max-md:text-sm font-semibold bg-rose-100 hover:bg-rose-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                    onClick={async () => await handleSelectInviteOption("decline")}
                    aria-disabled={processingSelection || isPending}
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

export function InvitedProfileOptions({
    currUserId,
    targetUserId,
}: {
    currUserId: string,
    targetUserId: string,
}) {
    const [ cancelling, setCancellng ] = useState<boolean>(false);
    const [ isPending, startTransition ] = useTransition();
    const { refresh } = useRouter();

    const handleCancelInvitation = useCallback(async () => {
        setCancellng(true);
        const error = await cancelFriendInvite(currUserId, targetUserId);
        if (error) {
            console.error(error.message);
        }
        startTransition(refresh);
        setCancellng(false);
    }, [currUserId, targetUserId]);

    return (
        <div className="flex flex-row justify-end max-md:justify-center items-center gap-3 max-md:gap-1 max-md:mx-3">
            <button
                className="flex justify-center items-center border border-blue-500 hover:border-blue-600 rounded-lg w-28 max-md:w-full h-12 max-md:h-10 px-6 text-blue-500 hover:text-white max-md:text-sm font-semibold bg-sky-100 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 after:content-['Pending'] hover:after:content-['Cancel'] focus:after:content-['Cancel']"
                onClick={handleCancelInvitation}
                aria-disabled={cancelling || isPending}
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

export function BlockedProfileOptions({
    currUserId,
    targetUserId,
}: {
    currUserId: string,
    targetUserId: string,
}) {
    return (
        <div>
            
        </div>
    )
}