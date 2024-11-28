import InvitationCard from "@/components/dashboard/friends/invitation-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { FriendsData } from "@/lib/types/friend";
import { getUserFriends } from "@/lib/data/friend";

export default async function FriendInvitationsCarousel({ currUserId }: { currUserId: string }) {
    const { status, message, data } = await getUserFriends(currUserId, "pending", 6);
    if (status !== "success" || !data) {
        console.error(message || "Error fetching friend invites");
    }
    const invitations = data ? data["userFriendsData"] satisfies FriendsData[] : [];

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-[93%] max-lg:w-[88%] max-md:w-5/6"
        >
            <CarouselContent className="-ml-2 px-1 py-4">
                {invitations.map((invitation, idx) => {
                    return (
                        <CarouselItem key={`invitation_${idx}`} className="relative pl-2 md:basis-1/2 lg:basis-1/3">
                            <InvitationCard invitationData={invitation} />
                        </CarouselItem>
                    )
                })}
                {invitations.length === 0 && 
                    <CarouselItem className="opacity-80">
                        <div className="flex flex-col justify-center items-center gap-y-2 border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md text-center text-gray-800">
                            <h3 className="font-semibold text-xl">
                                No pending invitations
                            </h3>
                            <p className="text-sm text-gray-500">
                                Return regularly to check for new friend invites
                            </p>
                        </div>
                    </CarouselItem>
                }
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}