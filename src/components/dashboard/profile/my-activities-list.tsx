import { getUserTransactions } from "@/lib/data/transaction";
import { TransactionItem } from "@/lib/types/transactions";
import { transactionCategories } from "@/lib/utils/constant";
import { formatDateTime, formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import clsx from "clsx";

export default async function MyActivitiesList({ userId }: { userId: string }) {
  let userTransactionData: TransactionItem[] = [];
  const { status, message, data } = await getUserTransactions(userId, 5);
  if (status !== "success" || !data) {
    console.error(message || "Error fetching user transactions data");
  } else {
    userTransactionData = data["transactionItems"];
  }

  if (userTransactionData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-48 my-6 border-0 rounded-xl bg-gray-100">
        <p className="text-center text-xl max-md:text-lg font-semibold">
          No activities
        </p>
        <p className="px-2 text-center text-sm">
          Start creating transactions to view your latest activities
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col items-center gap-3 w-full py-4 max-md:py-3">
      {userTransactionData.map((transaction, idx) => {
        return (
          <li
            key={`transaction_${idx}`}
            className="border border-slate-100 rounded-xl w-full h-20 max-md:h-16 bg-white shadow-md text-gray-800 hover:scale-[101%] duration-200"
          >
            <Link
              href={`/dashboard/transactions/${transaction.transaction_id}`}
              className="flex justify-between items-center w-full h-full px-6 py-3"
            >
              <div className="grid grid-cols-10 gap-2 w-2/3 max-lg:w-3/4 whitespace-nowrap overflow-hidden">
                <p className="col-span-4 max-lg:col-span-6 max-md:col-span-5 max-md:text-sm font-semibold text-ellipsis overflow-hidden">
                  {transaction.title}
                </p>
                <p
                  className={clsx(
                    "col-span-3 max-lg:col-span-4 max-md:col-span-5 px-3 whitespace-nowrap max-md:text-sm font-semibold text-ellipsis overflow-hidden",
                    { "text-green-500": transaction.recipient_id === userId },
                    { "text-red-500": transaction.payer_id === userId }
                  )}
                >
                  <span>{transaction.recipient_id === userId ? "+" : "-"}</span>
                  {formatCurrency(
                    Math.trunc(
                      transaction.amount *
                        (transaction.recipient_id === userId &&
                        transaction.exchange_rate
                          ? transaction.exchange_rate
                          : 1)
                    ),
                    transaction.recipient_id === userId
                      ? transaction.recipient_currency || "USD"
                      : transaction.payer_currency || "USD"
                  )}
                </p>
                <p className="col-span-3 max-lg:hidden font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                  {transaction.category_id
                    ? transactionCategories[transaction.category_id].name
                    : transaction.budget_id &&
                      transaction.budget_data &&
                      transaction.budget_data.category_id
                    ? transactionCategories[transaction.budget_data.category_id]
                        .name
                    : "--"}
                </p>
              </div>
              <div className="lg:hidden text-sm">
                {transaction.created_at
                  ? formatDateTime(transaction.created_at, true)
                  : "--"}
              </div>
              <div className="max-lg:hidden text-sm">
                {transaction.created_at
                  ? formatDateTime(transaction.created_at)
                  : "--"}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
