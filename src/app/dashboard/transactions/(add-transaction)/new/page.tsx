import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBalanceData } from "@/lib/actions/user";
import { getTotalTransactionAmount } from "@/lib/actions/transaction";
import { UserBalanceData } from "@/lib/types/user";
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
        } = await getTotalTransactionAmount(user.id, "Expenditure", monthStartDateTime, currDateTime);
        if (transactionAmountStatus !== "success") {
            console.error(transactionAmountMessage);
        } else if (transactionAmountData) {
            remainingSpendingLimitInCents -= transactionAmountData["transactionAmount"] as number;
        }
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
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