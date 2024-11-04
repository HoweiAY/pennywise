import InvitationCard from "@/components/dashboard/friends/invitation-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default async function FriendInvitationsCarousel() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-[93%] max-lg:w-[88%] max-md:w-5/6"
        >
            <CarouselContent className="-ml-2 px-1 py-4">
                {Array.from({ length: 3 }).map((_, idx) => {
                    return (
                        <CarouselItem key={`invitation_${idx}`} className="relative pl-2 md:basis-1/2 lg:basis-1/3">
                            <InvitationCard />
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}