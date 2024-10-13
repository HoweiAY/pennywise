import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

export default async function UserBudgetCardCarousel() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-[93%] max-lg:w-[88%] max-md:w-5/6"
        >
            <CarouselContent className="-ml-2 px-1 py-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <UserBudgetCard key={index} />
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      )
}

function UserBudgetCard() {
    return (
        <CarouselItem className="relative pl-2 md:basis-1/2 lg:basis-1/3 hover:scale-[102%] duration-200">
            <Link
                href={"/dashboard/budget/1"}
                className="flex flex-col border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md text-gray-800"
            >
                <header>
                    <h3 className="text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        Budget #1
                    </h3>
                    <h4 className="text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
                        Food and Drinks
                    </h4>
                </header>
                <p className="mt-2 max-md:mt-1 text-3xl max-lg:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    {formatCurrency(42069, "USD")}
                </p>
                <p className="text-xs lg:text-sm max-md:text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                    Left this month: {formatCurrency(6969, "USD")}
                </p>
            </Link>
            <div className="absolute bottom-3 right-4 flex flex-row items-center gap-1">
                <Link
                    href={"/dashboard/budget/1/edit"}
                    className="border-0 rounded-full p-2 text-blue-500 hover:bg-sky-100 hover:text-blue-600 duration-200"
                >
                    <PencilIcon className="w-4 h-4" />
                </Link>
                <button className="border-0 rounded-full p-2 hover:bg-rose-600 text-rose-600 hover:text-white duration-200">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </CarouselItem>
    )
}