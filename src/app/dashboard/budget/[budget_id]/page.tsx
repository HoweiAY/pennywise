import BudgetTransactionsTable from "@/components/dashboard/budget/budget-transactions-table";
import DeleteBudgetDialog from "@/components/dashboard/budget/delete-budget-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { budgetCategories } from "@/lib/utils/constant";
import { formatCurrency, formatCurrencySymbol } from "@/lib/utils/format";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBudgetById, getBudgetAmountSpent } from "@/lib/actions/budget";
import { BudgetFormData } from "@/lib/types/form-state";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function generateMetadata(
    { params }: { params: { budget_id: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { status, data } = await getUserBudgetById(params.budget_id);
    if (status === "success" && data) {
        const { name: budgetName } = data["budgetData"] as BudgetFormData;
        return {
            title: `${budgetName} - PennyWise`,
        }
    }
    return { title: "Budget Details - PennyWise" };
}

export default async function ViewBudget({ params }: { params: { budget_id: string } }) {
    const { user } = await getAuthUser();
    const {
        status: userBudgetStatus,
        message: userBudgetMessage,
        data: userBudgetData,
    } = await getUserBudgetById(params.budget_id);
    if (userBudgetStatus !== "success" || !userBudgetData) {
        throw new Error(userBudgetMessage || "Error: budget not found");
    }
    const {
        name,
        category_id: categoryId,
        currency,
        amount: amountInCents,
        user_id,
        description,
    } = userBudgetData["budgetData"];
    if (user_id !== user.id) {
        redirect("/dashboard");
    }

    const currDateTime = new Date();
    const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
    const {
        status: spentBudgetStatus,
        message: spentBudgetMessage,
        data: spentBudgetData,
    } = await getBudgetAmountSpent(params.budget_id, monthStartDateTime, currDateTime);
    if (spentBudgetStatus !== "success") {
        console.error(spentBudgetMessage);
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Budget Details
                </h1>
                <section className="mt-6 mb-4 border border-slate-100 rounded-xl p-6 bg-white shadow-lg">
                    <div className="flex flex-row justify-between items-center space-x-6 max-md:mb-2">
                        <h2 className="text-2xl max-md:text-xl font-semibold overflow-hidden text-nowrap text-ellipsis">
                            {name}
                        </h2>
                        <div className="flex flex-row justify-end items-center gap-2">
                            <Link
                                href={`/dashboard/budget/${params.budget_id}/edit`}
                                className="flex flex-row justify-center items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 max-md:px-4 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                                Edit
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="flex justify-center items-center border border-slate-100 rounded-lg w-12 h-10 max-md:px-4 text-rose-600 bg-gray-50 hover:bg-rose-600 hover:text-white shadow-md shadow-slate-300 duration-200">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </AlertDialogTrigger>
                                <DeleteBudgetDialog budgetId={params.budget_id} rerouteOnDelete={true} />
                            </AlertDialog>
                        </div>
                    </div>
                    <p className="pt-3 max-md:pt-1 text-5xl max-md:text-4xl font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {formatCurrency(amountInCents, currency)}
                    </p>
                    <p className="max-md:text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                        Left this month: {
                            spentBudgetData
                                ? formatCurrency(amountInCents - spentBudgetData["spentBudget"], currency)
                                : `${formatCurrencySymbol(currency)} --`
                            }
                    </p>    
                    <p className="mt-3 font-semibold">
                        Category: <span className="text-gray-800 font-normal">{budgetCategories[categoryId].name}</span>
                    </p>
                    <p className="mt-3 max-md:mt-1 font-semibold">
                        Description:
                        <span className="text-gray-800 font-normal">{!description && " none"}</span>
                    </p>
                    {description && 
                        <p className="border border-gray-200 rounded-lg min-h-20 p-2 mt-2 text-gray-800 max-md:text-sm bg-white">
                            {description}
                        </p>
                    }
                </section>
                <h1 className="mt-8 pb-1 text-2xl max-md:text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Related Transactions
                </h1>
                <BudgetTransactionsTable />
            </div>
        </main>
    )
}