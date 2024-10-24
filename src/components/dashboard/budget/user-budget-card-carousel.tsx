import DeleteBudgetDialog from "@/components/dashboard/budget/delete-budget-dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency, formatCurrencySymbol } from "@/lib/utils/format";
import { budgetCategories } from "@/lib/utils/constant";
import { getUserBudgets, getBudgetAmountSpent } from "@/lib/actions/budget";
import { BudgetCategoryId } from "@/lib/types/budget";
import { TransactionCategoryId } from "@/lib/types/transactions";
import Link from "next/link";
import { BudgetFormData } from "@/lib/types/form-state";

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
                        <UserBudgetCard
                            key={idx}
                            budget_id={budget.budget_id!}
                            name={budget.name}
                            categoryId={budget.category_id as TransactionCategoryId}
                            currency={budget.currency}
                            amountInCents={budget.amount}
                        />
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

async function UserBudgetCard({
    budget_id,
    name,
    categoryId,
    currency,
    amountInCents,
}: {
    budget_id: string,
    name: string,
    categoryId: BudgetCategoryId,
    currency: string,
    amountInCents: number,
}) {
    const currDateTime = new Date();
    const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
    const { status, message, data } = await getBudgetAmountSpent(budget_id, monthStartDateTime, currDateTime);
    if (status !== "success") {
        console.error(message);
    }

    return (
        <CarouselItem className="relative pl-2 md:basis-1/2 lg:basis-1/3 hover:scale-[102%] duration-200">
            <Link
                href={`/dashboard/budget/${budget_id}`}
                className="flex flex-col border border-slate-100 rounded-xl w-full h-44 p-6 bg-white shadow-md text-gray-800"
            >
                <header>
                    <h3 className="text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        {name}
                    </h3>
                    <h4 className="text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis">
                        {budgetCategories[categoryId].name}
                    </h4>
                </header>
                <p className="mt-2 max-md:mt-1 text-3xl max-lg:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    {formatCurrency(amountInCents, currency)}
                </p>
                <p className="text-xs lg:text-sm max-md:text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                    Left this month: {
                            data
                                ? formatCurrency(amountInCents - data["spentBudget"], currency)
                                : `${formatCurrencySymbol(currency)} --`
                            }
                </p>
            </Link>
            <div className="absolute bottom-3 right-4 flex flex-row items-center gap-1">
                <Link
                    href={`/dashboard/budget/${budget_id}/edit`}
                    className="border-0 rounded-full p-2 text-blue-500 hover:bg-sky-100 hover:text-blue-600 duration-200"
                >
                    <PencilIcon className="w-4 h-4" />
                </Link>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="border-0 rounded-full p-2 hover:bg-rose-600 text-rose-600 hover:text-white duration-200">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </AlertDialogTrigger>
                    <DeleteBudgetDialog budgetId={budget_id} />
                </AlertDialog>
            </div>
        </CarouselItem>
    )
}