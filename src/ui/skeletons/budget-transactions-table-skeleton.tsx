import BudgetTransactionsTablePagination from "@/components/dashboard/budget/budget-transactions-table-pagination";

export default function BudgetTransactionsTableSkeleton({
    itemsPerPage,
    totalPageCount,
}: {
    itemsPerPage: number,
    totalPageCount: number,
}) {
    return (
        <section className="flex flex-col border border-slate-100 rounded-xl min-h-96 px-6 py-6 max-md:px-3 mb-10 bg-white shadow-lg">
            <table className="table-auto border-0 rounded-t-lg min-w-full bg-slate-50 overflow-hidden">
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
            </table>
            <ol>
                {Array.from({ length: itemsPerPage }).map((_, idx) => {
                    return (
                        <li
                            key={`transaction_${idx}_skeleton`}
                            className="flex items-center border-b last:border-0 last:rounded-b-lg w-full h-16 py-3 text-sm odd:bg-gray-100 even:bg-gray-50"
                        >
                            <div className="animate-pulse w-14 px-2">
                                <div className="h-10 w-10 rounded-full bg-gray-300" />
                            </div>
                            <div className="animate-pulse flex justify-center items-center w-full h-16 px-6">
                                <div className="w-full h-6 rounded-md bg-gray-300" />
                            </div>
                        </li>
                    )
                })}
            </ol>
            <BudgetTransactionsTablePagination
                currPage={1}
                totalPageCount={totalPageCount}
                disabled={true}
            />
        </section>
    )
}