import DeleteTransactionDialog from "@/components/dashboard/transactions/delete-transaction-dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRightIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getAuthUser } from "@/lib/actions/auth";
import { getTransactionById } from "@/lib/actions/transaction";
import { transactionCategories } from "@/lib/utils/constant";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { TransactionCategoryId, TransactionItem } from "@/lib/types/transactions";
import { redirect } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";


export default async function ViewTransaction({ params }: { params: { transaction_id: string } }) {
    const { user } = await getAuthUser();
    const { status, message, data } = await getTransactionById(params.transaction_id);
    if (status !== "success" || !data) {
        throw new Error(message || "Error: transaction not found");
    }
    const {
        title,
        amount,
        transaction_type,
        category_id,
        payer_currency,
        recipient_currency,
        exchange_rate,
        payer_id,
        recipient_id,
        budget_id,
        budget_data,
        description,
        created_at,
    } = data["transactionData"] as TransactionItem;
    if (payer_id !== user.id && recipient_id !== user.id) {
        redirect("/dashboard");
    }

    let amountInCents = amount, amountMessage = "You deposited:";
    switch (transaction_type) {
        case "Expense":
            amountInCents = -amountInCents;
            amountMessage = "You spent:";
            break;
        case "Pay friend":
            if (payer_id === user.id) {
                amountInCents = -amountInCents;
                amountMessage = "You paid:";
            } else if (payer_currency !== recipient_currency && exchange_rate) {
                amountInCents *= exchange_rate;
                amountMessage = "You received:";
            }
            break;
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Transaction Details
                </h1>
                <section className="flex flex-col my-6">
                    <div className="flex flex-row justify-between items-center space-x-6 max-md:mb-2">
                        <h2 className="text-2xl max-md:text-xl font-semibold overflow-hidden text-nowrap text-ellipsis">
                            {title}
                        </h2>
                        <div className="flex flex-row justify-end items-center gap-2">
                            <Link
                                href={`/dashboard/transactions/${params.transaction_id}/edit`}
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
                                <DeleteTransactionDialog transactionId={params.transaction_id} rerouteOnDelete={true} />
                            </AlertDialog>
                        </div>
                    </div>
                    <div className="max-md:self-center max-md:flex max-md:flex-col max-md:justify-center max-md:items-center border border-slate-100 rounded-xl w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-w-full max-md:min-h-40 p-6 mt-6 bg-white shadow-lg duration-200">
                        <p className="md:text-lg font-semibold">
                            {amountMessage}
                        </p>
                        <p className={clsx(
                            "py-2 max-md:pb-0 text-5xl max-md:text-4xl font-semibold overflow-hidden text-nowrap text-ellipsis",
                            { "text-red-500": amountInCents < 0 },
                            { "text-green-500": amountInCents >= 0 },
                        )}>
                            <span className={amountInCents < 0 ? "hidden" : "inline"}>+</span>
                            {formatCurrency(amountInCents, "USD")}
                        </p>
                        <p className="mt-2 text-sm max-md:text-xs text-gray-500">
                            on {created_at ? formatDateTime(created_at) : "--"}
                        </p>
                    </div>
                    <p className="mt-6 font-semibold">
                        <span>Category: </span>
                        <span className="text-gray-800 font-normal">
                            {category_id
                                ? transactionCategories[category_id as TransactionCategoryId].name
                                : budget_data && budget_data.category_id
                                ? transactionCategories[budget_data.category_id].name
                                : "--"
                            }
                        </span>
                    </p>
                    {budget_data &&
                        <p className="mt-3 font-semibold">
                            Budget: <span className="text-gray-800 font-normal">{budget_data.name}</span>
                        </p>
                    }
                    <p className="mt-3 font-semibold">
                        Description:
                        <span className="text-gray-800 font-normal">{!description && " none"}</span>
                    </p>
                    {description &&
                        <p className="border border-gray-200 rounded-lg min-h-20 p-2 mt-2 text-gray-800 max-md:text-sm bg-white">
                            {description}
                        </p>
                    }
                    {budget_id &&
                        <Link
                            href={`/dashboard/budget/${budget_id}`}
                            className="flex flex-row justify-between items-center rounded-md w-40 max-md:w-36 px-4 py-2 mt-4 mr-6 max-md:mr-3 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 transition-colors duration-200"
                        >
                            View budget
                            <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    }
                    <Link
                        href={"/dashboard/transactions"}
                        className="flex items-center rounded-md w-fit px-4 py-2 mt-6 mr-6 max-md:mr-3 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 transition-colors duration-200"
                    >
                        Back
                    </Link>
                </section>
            </div>
        </main>
    )
}