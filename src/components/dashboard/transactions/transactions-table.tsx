import TransactionsTablePagination from "@/components/dashboard/transactions/transactions-table-pagination";
import DeleteTransactionDialog from "@/components/dashboard/transactions/delete-transaction-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EllipsisVerticalIcon, InformationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getFilteredTransactions } from "@/lib/actions/transaction";
import { transactionCategories } from "@/lib/utils/constant";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import Link from "next/link";
import clsx from "clsx";

export default async function TransactionsTable({
    searchQuery,
    currPage,
    totalPageCount,
    itemsPerPage,
}: {
    searchQuery: string,
    currPage: number,
    totalPageCount: number,
    itemsPerPage: number,
}) {
    const { transactionItems, errorMessage } = await getFilteredTransactions(searchQuery, currPage, itemsPerPage);

    return (
        <section className="flex flex-col border border-slate-100 rounded-xl min-h-96 px-6 pb-6 max-md:px-3 mb-10 bg-white shadow-lg">
            <h1 className="py-6 max-md:py-4 text-2xl max-md:text-xl font-semibold">
                Latest Transactions
            </h1>
            <table className="table-auto border-0 rounded-lg min-w-full bg-gray-50 overflow-hidden max-lg:hidden">
                <thead className="text-left font-normal">
                    <tr>
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
                            Type
                        </th>
                        <th scope="col" className="px-3 py-5 font-semibold">
                            Category
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
                                <td className={clsx(
                                    "px-3 whitespace-nowrap font-semibold text-ellipsis overflow-hidden",
                                    { "text-green-500": transaction.transaction_type === "Deposit" },
                                    { "text-red-500": transaction.transaction_type !== "Deposit" },
                                )}>
                                    <span>{transaction.transaction_type === "Deposit" ? "+" : "-"}</span>
                                    {formatCurrency(
                                        transaction.amount,
                                        transaction.transaction_type === "Deposit"
                                            ? transaction.recipient_currency
                                            : transaction.payer_currency,
                                    )}
                                </td>
                                <td className="px-3 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                                    {transaction.transaction_type}
                                </td>
                                <td className="max-w-24 px-3 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                                    {transaction.category_id ? transactionCategories[transaction.category_id].name : "--"}
                                </td>
                                <td className="max-w-24 px-3 font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                                    {formatDateTime(transaction.created_at)}
                                </td>
                                <td>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                                                <EllipsisVerticalIcon className="w-6 h-6" /> 
                                            </button>
                                        </DropdownMenuTrigger>
                                        <OptionsMenu
                                            transactionId={transaction.transaction_id}
                                            deletable={transaction.transaction_type !== "Pay friend"}
                                        />
                                    </DropdownMenu>
                                </td>
                            </tr>        
                        )
                    })}
                </tbody>
            </table>
            <div className="lg:hidden rounded-lg border-0 min-w-full text-xs bg-gray-50 overflow-hidden">
                <div className="grid grid-cols-2 w-full ps-3 pe-8 py-5 max-md:ps-2 max-md:py-3 text-left text-sm font-semibold">
                    <div className="flex flex-row items-center gap-x-2 md:gap-x-4">
                        <div className="w-10 min-w-10" />
                        <h2>Title</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <h2 className="px-3">Amount</h2>
                        <h2 className="max-md:text-end">Date</h2>
                    </div>
                </div>
                {transactionItems?.map((transaction, idx) => {
                    return (
                        <div
                            key={`transaction_${idx}_sm`}
                            className="relative grid grid-cols-2 border-b last:border-0 w-full h-16 ps-3 pe-8 max-md:ps-2 odd:bg-gray-50 even:bg-gray-100"
                        >
                            <div className="flex flex-row items-center gap-x-2 md:gap-x-4 text-ellipsis overflow-hidden">
                                <div className="h-10 w-10 min-w-10 border-2 border-gray-700 rounded-full">

                                </div>
                                <div className="w-full whitespace-nowrap overflow-hidden">
                                    <p className="font-semibold text-sm text-ellipsis overflow-hidden">{transaction.title}</p>
                                    <p className="text-gray-500 text-ellipsis overflow-hidden">{transaction.description}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className={clsx(
                                    "flex items-center px-3 whitespace-nowrap font-semibold",
                                    { "text-green-500": transaction.transaction_type === "Deposit" },
                                    { "text-red-500": transaction.transaction_type !== "Deposit" },
                                )}>
                                    <span>{transaction.transaction_type === "Deposit" ? "+" : "-"}</span>
                                    {formatCurrency(
                                        transaction.amount,
                                        transaction.transaction_type === "Deposit"
                                            ? transaction.recipient_currency
                                            : transaction.payer_currency,
                                    )}
                                </div>
                                <p className="max-md:hidden flex items-center whitespace-nowrap text-ellipsis overflow-hidden">
                                    <span className="text-ellipsis overflow-hidden">{formatDateTime(transaction.created_at)}</span>
                                </p>
                                <p className="md:hidden flex justify-end items-center whitespace-nowrap text-ellipsis overflow-hidden">
                                    {formatDateTime(transaction.created_at, true)}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="absolute right-1 bottom-5 border-0 rounded-full p-1 hover:bg-gray-200 duration-200">
                                        <EllipsisVerticalIcon className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <OptionsMenu
                                    transactionId={transaction.transaction_id}
                                    deletable={transaction.transaction_type !== "Pay friend"}
                                />
                            </DropdownMenu>
                        </div>
                    )
                })}
            </div>
            {transactionItems?.length === 0 && 
                <div className="flex flex-col justify-center items-center w-full h-48 border-0 rounded-lg bg-gray-100">
                    <p className="text-center text-xl max-md:text-lg font-semibold">
                        {searchQuery ? "No results found" : "No transactions"}
                    </p>
                    <p className="px-2 text-center text-sm">
                        {searchQuery ? "There are no matching transactions for your search" : "Add a new transaction to get started!"}
                    </p>
                </div>
            }
            <TransactionsTablePagination currPage={currPage} totalPageCount={totalPageCount} />
        </section>
    )
}

function OptionsMenu({ transactionId, deletable }: { transactionId: string, deletable: boolean }) {
    return (
        <AlertDialog>
            <DropdownMenuContent>
                <Link href={`/dashboard/transactions/${transactionId}`}>
                    <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                        <InformationCircleIcon className="w-4 h-4" />
                        <p>Details</p>
                    </DropdownMenuItem>
                </Link>
                <Link href={`/dashboard/transactions/${transactionId}/edit`}>
                    <DropdownMenuItem className="w-full hover:cursor-pointer max-lg:text-sm">
                        <PencilIcon className="w-4 h-4" />
                        <p>Edit</p>
                    </DropdownMenuItem>
                </Link>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className={clsx(
                        "hover:cursor-pointer max-lg:text-sm",
                        {"hidden": !deletable},
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