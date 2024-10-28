import UserBudgetCard from "@/components/dashboard/budget/user-budget-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { getUserBudgets } from "@/lib/data/budget";
import { BudgetFormData } from "@/lib/types/form-state";
import { TransactionCategoryId } from "@/lib/types/transactions";

export default async function UserBudgetCardCarousel({ userId }: { userId: string }) {
    const { status, message, data } = await getUserBudgets(userId);
    if (status !== "success") {
        throw new Error(message || "Error: failed to fetch user budgets");
    }
    const userBudgetData = data ? data["userBudgetData"] as BudgetFormData[] : [];

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-[93%] max-lg:w-[88%] max-md:w-5/6"
        >
            <CarouselContent className="-ml-2 px-1 py-4">
                {userBudgetData.map((budget, idx) => {
                    return (
                        <CarouselItem key={idx} className="relative pl-2 md:basis-1/2 lg:basis-1/3">
                            <UserBudgetCard
                                budget_id={budget.budget_id!}
                                name={budget.name}
                                categoryId={budget.category_id as TransactionCategoryId}
                                currency={budget.currency}
                                amountInCents={budget.amount}
                            />
                        </CarouselItem>
                    )
                })}
                {userBudgetData.length === 0 && 
                    <CarouselItem className="opacity-80">
                        <div className="flex flex-col justify-center items-center gap-y-2 border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md text-center text-gray-800">
                            <h3 className="font-semibold text-xl">
                                No budgets planned
                            </h3>
                            <p className="text-sm text-gray-500">
                                Create a new budget to start planning your finance
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