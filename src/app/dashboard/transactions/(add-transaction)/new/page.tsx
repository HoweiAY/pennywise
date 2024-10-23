import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBalanceData } from "@/lib/actions/user";
import { getTotalTransactionAmount } from "@/lib/actions/transaction";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Transaction - PennyWise",
}

export default async function AddTransaction() {
    const { user } = await getAuthUser();
    const { userBalanceData, errorMessage: userBalanceDataErrorMessage } = await getUserBalanceData(user.id);
    if (userBalanceDataErrorMessage || !userBalanceData) {
        throw new Error(userBalanceDataErrorMessage || "Error: user balance information not found");
    }
    const { currency, balance: balanceInCents } = userBalanceData;

    let remainingSpendingLimitInCents = userBalanceData.spending_limit;
    if (remainingSpendingLimitInCents) {
        const currDateTime = new Date();
        const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
        const {
            transactionAmountData,
            errorMessage: transactionAmountDataErrorMessage,
        } = await getTotalTransactionAmount(user.id, "Expenditure", monthStartDateTime, currDateTime);
        if (!transactionAmountDataErrorMessage && transactionAmountData) {
            remainingSpendingLimitInCents -= transactionAmountData[0].totalAmount;
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