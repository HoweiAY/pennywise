import BudgetTransactionsTable from "@/components/dashboard/budget/budget-transactions-table";
import DeleteBudgetDialog from "@/components/dashboard/budget/delete-budget-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { budgetCategories } from "@/lib/utils/constant";
import { formatCurrency } from "@/lib/utils/format";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

export async function generateMetadata(
    { params }: { params: { budget_id: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("budgets")
        .select("name")
        .eq("budget_id", params.budget_id)
        .limit(1);
    if (!error && data.length > 0) {
        const { name: budgetName } = data[0];
        return {
            title: `${budgetName} - PennyWise`,
        }
    }
    return { title: "Budget Details - PennyWise" };
}

export default async function ViewBudget({ params }: { params: { budget_id: string } }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }
    const { data: budgetData, error } = await supabase
        .from("budgets")
        .select("name, category_id, currency, amount, user_id, description")
        .eq("budget_id", params.budget_id)
        .limit(1);
    if (error) throw error;
    const {
        name,
        category_id: categoryId,
        currency,
        amount: amountInCents,
        user_id,
        description,
    } = budgetData[0];
    if (user_id !== user.id) {
        redirect("/dashboard");
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
                                <DeleteBudgetDialog budgetId={params.budget_id} redirectOnDelete={true} />
                            </AlertDialog>
                        </div>
                    </div>
                    <p className="pt-3 max-md:pt-1 text-5xl max-md:text-4xl font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {formatCurrency(amountInCents, currency)}
                    </p>
                    <p className="max-md:text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                        Left this month: $ --
                    </p>    
                    <p className="mt-3 font-semibold">
                        Category: <span className="text-gray-800 font-normal">{budgetCategories[categoryId].name}</span>
                    </p>
                    <p className="mt-3 max-md:mt-1 font-semibold">
                        Description:
                        <span className="text-gray-800 font-normal">{!description && " none"}</span>
                    </p>
                    {description && 
                        <p className="mt-1 text-gray-800 max-md:text-sm">
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