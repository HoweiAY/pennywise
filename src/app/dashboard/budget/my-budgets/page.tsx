import UserBudgetCard from "@/components/dashboard/budget/user-budget-card";
import UserBudgetCardSkeleton from "@/ui/skeletons/user-budget-card-skeleton";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAuthUser } from "@/lib/data/auth";
import { getUserBudgets } from "@/lib/data/budget";
import { BudgetFormData } from "@/lib/types/form-state";
import { TransactionCategoryId } from "@/lib/types/transactions";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "My Budgets - PennyWise",
};

export default async function MyBudgets() {
    const { user } = await getAuthUser();
    const { status, message, data } = await getUserBudgets(user.id);
    if (status !== "success") {
        throw new Error(message || "Error: failed to fetch user budgets");
    }
    const userBudgetData = data ? data["userBudgetData"] as BudgetFormData[] : [];

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <header>
                    <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        My Budgets
                    </h1>
                    <p className="mt-1 md:me-4 max-md:my-1 max-md:text-sm text-gray-500">
                        View and manage all your budget plans
                    </p>
                </header>
                <div className="flex justify-start items-center w-full mt-6 mb-2">
                    <Link
                        href={"/dashboard/budget/new"}
                        className="flex flex-row items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 max-md:px-3 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                    >
                        <PlusIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                        <span className="mr-1 max-md:text-sm">New Budget</span>
                    </Link>
                </div>
                <div className="grid grid-flow-row grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 py-4">
                    {userBudgetData.map((budget, idx) => {
                        return (
                            <Suspense key={idx} fallback={<UserBudgetCardSkeleton />}>
                                <UserBudgetCard
                                    budget_id={budget.budget_id!}
                                    name={budget.name}
                                    categoryId={budget.category_id as TransactionCategoryId}
                                    currency={budget.currency}
                                    amountInCents={budget.amount}
                                />
                            </Suspense>
                        )
                    })}
                </div>
                {userBudgetData.length === 0 &&
                    <div className="flex flex-col justify-center items-center border-o rounded-xl w-full h-64 p-6 mb-4 bg-gray-100">
                        <h3 className="font-semibold text-xl">
                            No budgets planned
                        </h3>
                        <p className="text-sm text-gray-500">
                            Create a new budget to start planning your finance
                        </p>
                    </div>
                }
            </div>
        </main>
    )
}