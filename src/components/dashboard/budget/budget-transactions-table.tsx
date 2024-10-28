import BudgetTransactionsTablePagination from "@/components/dashboard/budget/budget-transactions-table-pagination";
import DeleteTransactionDialog from "@/components/dashboard/transactions/delete-transaction-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EllipsisVerticalIcon, InformationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { transactionCategories } from "@/lib/utils/constant";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { TransactionItem } from "@/lib/types/transactions";
import { getBudgetTransactions } from "@/lib/data/transaction";
import Link from "next/link";
import clsx from "clsx";

export default async function BudgetTransactionsTable({
    budgetId,
    currPage,
    totalPageCount,
    itemsPerPage,
}: {
    budgetId: string,
    currPage: number,
    totalPageCount: number,
    itemsPerPage: number,
}) {
    const { status, message, data } = await getBudgetTransactions(budgetId, currPage, itemsPerPage);
    if (status !== "success") {
        console.error(message);
    }
    const transactionItems = data ? data["transactionItems"] as TransactionItem[] : [];

    return (
        <section className="flex flex-col border border-slate-100 rounded-xl min-h-96 px-6 py-6 max-md:px-3 mb-10 bg-white shadow-lg">
            <table className="table-auto border-0 rounded-lg min-w-full bg-slate-50 overflow-hidden">
                <thead className="text-left">
                    <tr className="border-b">
                        <th scope="col" className="px-3 py-5 font-semibold">
                            <span className="sr-only">User avatar</span>
                        </th>
                        <th scope="col" className="px-3 py-5 font-semibold">
                            Title
                        </th>
                        <th scope="col" className="px-3 py-5 font-semibold">
                            Amount
                        </th>
                        <th scope="col" className="px-3 py-5 font-semibold">
                            Date
                        </th>
                        <th>
                            <span className="sr-only">Options</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactionItems?.map((transaction, idx) => {
                        return (
                            <tr
                                key={`transaction_${idx}`}
                                className="border-b last:border-0 w-full h-16 py-3 text-sm odd:bg-gray-100 even:bg-gray-50"
                            >
                                <td className="w-14 px-2">
                                    <div className="h-10 w-10 border-2 border-gray-700 rounded-full">

                                    </div>
                                </td>
                                <td className="max-w-32 px-3 font-medium whitespace-nowrap">
                                    <p className="font-semibold text-ellipsis overflow-hidden">{transaction.title}</p>
                                    <p className="text-xs text-gray-500 text-ellipsis overflow-hidden">{transaction.description}</p>
                                </td>
                                <td className="px-3 whitespace-nowrap font-semibold text-red-500 text-ellipsis overflow-hidden">
                                    <span>-</span>
                                    {formatCurrency(
                                        transaction.amount,
                                        transaction.transaction_type === "Deposit"
                                            ? transaction.recipient_currency || "USD"
                                            : transaction.payer_currency || "USD",
                                    )}
                                </td>
                                <td className="max-w-24 px-3 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                                    {transaction.created_at ? formatDateTime(transaction.created_at) : "--"}
                                </td>
                                <td className="flex justify-end items-center h-16 pr-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex justify-center items-center border-0 rounded-full w-10 h-10 max-md:w-7 max-md:h-7 p-1 hover:bg-gray-200 duration-200">
                                                <EllipsisVerticalIcon className="w-6 h-6" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <OptionsMenu
                                            transactionId={transaction.transaction_id ?? "#"}
                                            editable={transaction.transaction_type !== "Pay friend"}
                                            deletable={transaction.transaction_type !== "Pay friend"}
                                        />
                                    </DropdownMenu>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {transactionItems?.length === 0 && 
                <div className="flex flex-col justify-center items-center w-full h-48 mb-6 border-0 rounded-b-lg bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        No transactions
                    </p>
                    <p className="px-2 text-center text-sm">
                        Start adding tranasctions with this budget to view them
                    </p>
                </div>
            }
            <BudgetTransactionsTablePagination currPage={currPage} totalPageCount={totalPageCount} />
        </section>
    )
}

function OptionsMenu({ transactionId, editable, deletable }: { transactionId: string, editable: boolean, deletable: boolean }) {
    return (
        <AlertDialog>
            <DropdownMenuContent>
                <Link href={`/dashboard/transactions/${transactionId}`}>
                    <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                        <InformationCircleIcon className="w-4 h-4" />
                        <p>Details</p>
                    </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/transactions/${transactionId}/edit`} scroll={false}>
                    <DropdownMenuItem className={clsx(
                        "w-full hover:cursor-pointer max-lg:text-sm",
                        {"hidden": !editable},
                        )}>
                        <PencilIcon className="w-4 h-4" />
                        <p>Edit</p>
                    </DropdownMenuItem>
                </Link>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className={clsx(
                        "hover:cursor-pointer max-lg:text-sm",
                        { "hidden": !deletable },
                    )}>
                        <TrashIcon className="w-4 h-4 text-rose-600" />
                        <p className="text-rose-600">Delete</p>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
            <DeleteTransactionDialog transactionId={transactionId} />
        </AlertDialog>
    )
}