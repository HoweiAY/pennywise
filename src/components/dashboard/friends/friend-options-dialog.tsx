"use client";

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import { removeFriend, blockUser } from "@/lib/actions/friend";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function RemoveFriendDialog({
    currUserId,
    targetUserId,
    targetUsername,
}: {
    currUserId: string,
    targetUserId: string,
    targetUsername: string,
}) {
    const [ isPending, startTransition ] = useTransition();
    const [ removing, setRemoving ] = useState<boolean>(false);
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleRemoveFriend = useCallback(async () => {
        setRemoving(true);
        const error = await removeFriend(currUserId, targetUserId);
        if (error) {
            toast({
                variant: "destructive",
                title: "Remove failed",
                description: `An error has occurred while removing ${targetUsername} from friend list.`,
                action: (
                    <ToastAction altText="Try again" onClick={handleRemoveFriend}>
                        Try again
                    </ToastAction>
                ),
            });
            console.error(error.message);
        } else {
            startTransition(refresh);
            toast({
                title: "Friend removed",
                description: `${targetUsername} has been removed from your friend list.`,
            });
        }
        setRemoving(false);
    }, [currUserId, targetUserId, targetUsername]);

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                    {`Remove ${targetUsername} as friend?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {`This action will remove ${targetUsername} from your friend list.`}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className="bg-white hover:bg-sky-100 hover:text-blue-600 font-semibold shadow-md shadow-slate-300 duration-200">
                    Cancel
                </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow-md shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 duration-200"
                        onClick={handleRemoveFriend}
                        aria-disabled={removing || isPending}
                    >
                        Remove
                    </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export function BlockFriendDialog({
    currUserId,
    blockedId,
    blockedUsername,
}: {
    currUserId: string,
    blockedId: string,
    blockedUsername: string,
}) {
    const [ isPending, startTransition ] = useTransition();
    const [ blocking, setBlocking ] = useState<boolean>(false);
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleBlockFriend = useCallback(async () => {
        setBlocking(true);
        const error = await blockUser(currUserId, blockedId);
        if (error) {
            toast({
                variant: "destructive",
                title: "Block user failed",
                description: `An error has occurred while blocking ${blockedUsername}.`,
                action: (
                    <ToastAction altText="Try again" onClick={handleBlockFriend}>
                        Try again
                    </ToastAction>
                ),
            });
            console.error(error.message);
        } else {
            startTransition(refresh);
            toast({
                title: "User blocked",
                description: `${blockedUsername} has been blocked successfully.`,
            });
        }
        setBlocking(false);
    }, [currUserId, blockedId, blockedUsername]);

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                    {`Block ${blockedUsername}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {`${blockedUsername} will be blocked from your friend list.`}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className="bg-white hover:bg-sky-100 hover:text-blue-600 font-semibold shadow-md shadow-slate-300 duration-200">
                    Cancel
                </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow-md shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 duration-200"
                        onClick={handleBlockFriend}
                        aria-disabled={blocking || isPending}
                    >
                        Block
                    </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}