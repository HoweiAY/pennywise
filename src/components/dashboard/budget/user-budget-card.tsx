import DeleteBudgetDialog from "@/components/dashboard/budget/delete-budget-dialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getBudgetAmountSpent } from "@/lib/data/budget";
import { BudgetCategoryId } from "@/lib/types/budget";
import { budgetCategories } from "@/lib/utils/constant";
import { formatCurrency, formatCurrencySymbol } from "@/lib/utils/format";
import Link from "next/link";

export default async function UserBudgetCard({
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
        <div className="relative hover:scale-[102%] duration-200">
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
        </div>
    )
}