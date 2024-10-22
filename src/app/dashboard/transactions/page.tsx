import TransactionsSearchBar from "@/components/dashboard/transactions/transactions-search-bar";
import TransactionsTable from "@/components/dashboard/transactions/transactions-table";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getTransactionsPages } from "@/lib/actions/transaction";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Transactions - PennyWise",
};

export default async function Transactions({
    searchParams,
}: {
    searchParams?: {
        search?: string,
        page?: string,
    };
}) {
    const searchQuery = searchParams?.search || "";
    const currPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 10;
    const { totalPageCount, errorMessage } = await getTransactionsPages(itemsPerPage, searchQuery);

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 mb-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Transactions
                </h1>
                <div className="flex flex-row max-md:flex-col-reverse justify-between md:items-center gap-2 max-md:gap-y-4 mt-8 mb-6">
                    <TransactionsSearchBar />
                    <AddTransactionButton />
                </div>
                <TransactionsTable
                    searchQuery={searchQuery}
                    currPage={currPage}
                    totalPageCount={totalPageCount ?? 1}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </main>
    )
}

function AddTransactionButton() {
 return (
    <Link
        href={"/dashboard/transactions/new"}
        className="flex flex-row items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 max-md:px-3 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
    >
        <PlusIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
        <span className="mr-1 max-md:text-sm">Add Transaction</span>
    </Link>
 )
}