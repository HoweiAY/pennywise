import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/data/auth";
import { getUserBalanceData } from "@/lib/data/user";
import { getTotalTransactionAmount } from "@/lib/data/transaction";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Transaction - PennyWise",
}

export default async function AddTransaction() {
    const { user } = await getAuthUser();
    const { status, message, data } = await getUserBalanceData(user.id);
    if (status != "success" || !data) {
        throw new Error(message || "Error: user balance information not found");
    }
    let {
        currency, 
        balance: balanceInCents,
        spending_limit: remainingSpendingLimitInCents,
    } = data["userBalanceData"];

    if (remainingSpendingLimitInCents) {
        const currDateTime = new Date();
        const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
        const {
            status: transactionAmountStatus,
            message: transactionAmountMessage,
            data: transactionAmountData,
        } = await getTotalTransactionAmount(user.id, "expenditure", monthStartDateTime, currDateTime);
        if (transactionAmountStatus !== "success") {
            console.error(transactionAmountMessage);
        } else if (transactionAmountData) {
            remainingSpendingLimitInCents -= transactionAmountData["transactionAmount"] ?? 0;
        }
    }

    return (
        <main className="h-fit max-md:min-h-[80%] md:mb-2 overflow-hidden">
            <div className="px-6">
                <header>
                    <h1 className="mt-8 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        New Transaction
                    </h1>
                    <p className="my-2 md:me-4 max-md:my-1 max-md:text-sm text-gray-500">
                        Create a new transaction by entering the details below
                    </p>
                </header>
                <TransactionForm
                    userId={user.id}
                    currency={currency}
                    balanceInCents={balanceInCents}
                    remainingSpendingLimitInCents={remainingSpendingLimitInCents}
                />
            </div>
        </main>
    )
}