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
                        <CarouselItem
                            key={idx}
                            className="relative pl-2 md:basis-1/2 lg:basis-1/3 hover:scale-[102%] duration-200"
                        >
                            <div className="flex flex-col border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md">
                                <div className="animate-pulse w-3/4 h-10 rounded-md bg-gray-300" />
                                <div className="animate-pulse w-1/2 h-8 mt-6 rounded-md bg-gray-300" />
                                <div className="animate-pulse w-2/3 h-6 mt-1 rounded-md bg-gray-300" />
                            </div>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            <CarouselPrevious disabled={true} />
            <CarouselNext disabled={true} />
        </Carousel>
    )
}