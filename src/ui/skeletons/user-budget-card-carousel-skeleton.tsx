import UserBudgetCardSkeleton from "@/ui/skeletons/user-budget-card-skeleton";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function UserBudgetCardCarouselSkeleton() {
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
                        <CarouselItem key={idx} className="relative pl-2 md:basis-1/2 lg:basis-1/3 hover:scale-[102%] duration-200">
                            <UserBudgetCardSkeleton />
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious disabled={true} />
            <CarouselNext disabled={true} />
        </Carousel>
    )
}