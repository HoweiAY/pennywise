"use client";

import { ToastAction } from "@/components/ui/toast";
import avatarDefault from "@/ui/icons/avatar-default.png";
import { FriendsData } from "@/lib/types/friend";
import { acceptFriendInvite, declineFriendInvite } from "@/lib/actions/friend";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

export default function InvitationCard({ invitationData }: { invitationData: FriendsData }) {
    const [ processingSelection, setProcessingSelection ] = useState<boolean>(false);
    const [ isPending, startTransition ] = useTransition();
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleSelectInviteOption = useCallback(async (action: "accept" | "decline") => {
        setProcessingSelection(true);
        const error = await (action === "accept"
            ? acceptFriendInvite(invitationData.inviter_id, invitationData.invitee_id)
            : declineFriendInvite(invitationData.inviter_id, invitationData.invitee_id)
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
                    description: `You and ${invitationData.inviter_data?.username} are now friends.`,
                });
            }
        }
        setProcessingSelection(false);
    }, [invitationData]);
    
    return (
        <div className="relative hover:scale-[102%] duration-200">
            <div className="flex flex-row justify-between items-center border border-slate-100 rounded-xl w-full h-24 p-3 bg-white shadow-md text-gray-800">
                <Link
                    href={`/dashboard/profile/${invitationData.inviter_data?.username}`}
                    className="flex shrink-0 items-center gap-2 w-2/3 overflow-hidden"
                >
                    <div className="w-10 h-10 min-w-10 border-2 border-gray-700 rounded-full overflow-clip">
                        <Image
                            priority
                            loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                            src={invitationData.inviter_data?.avatar_url || avatarDefault.src}
                            width={40}
                            height={40}
                            alt={"User avatar"}
                        />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                        <p className="whitespace-nowrap font-semibold text-ellipsis overflow-hidden">
                            {invitationData.inviter_data?.username || "username"}
                        </p>
                        <p className="whitespace-nowrap text-gray-500 text-sm text-ellipsis overflow-hidden">
                            {`${invitationData.inviter_data?.first_name || "Firstname"} ${invitationData.inviter_data?.last_name || "Lastname"}`}
                        </p>
                    </div>
                </Link>
                <div className="flex flex-col justify-center items-center gap-2 w-1/3">
                    <button
                        className="border-0 rounded-md w-full p-2 text-center text-green-500 hover:text-white text-xs font-semibold bg-green-100 hover:bg-green-500 shadow-sm shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
                        onClick={async () => await handleSelectInviteOption("accept")}
                        aria-disabled={processingSelection}
                    >
                        Accept
                    </button>
                    <button
                        className="border rounded-md w-full p-2 text-center text-xs text-rose-600 font-semibold bg-white hover:bg-rose-600 hover:text-white shadow-sm shadow-slate-300 duration-200"
                        onClick={async () => await handleSelectInviteOption("decline")}
                        aria-disabled={processingSelection}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}