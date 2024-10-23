import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBalanceData } from "@/lib/actions/user";
import { getTransactionById, getTotalTransactionAmount } from "@/lib/actions/transaction";
import { getUserBudgets } from "@/lib/actions/budget";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit Transaction - PennyWise",
}

export default async function EditTransaction({ params }: { params: { transaction_id: string } }) {
    const { user } = await getAuthUser();
    const transactionAndBalanceData = await Promise.all([
        getTransactionById(params.transaction_id),
        getUserBalanceData(user.id),
        getUserBudgets(user.id),
    ]);
    const [
        { transactionData, errorMessage: transactionDataErrorMessage },
        { userBalanceData, errorMessage: userBalanceDataErrorMessage },
        { userBudgetData },
    ] = transactionAndBalanceData;
    if (transactionDataErrorMessage || !transactionData) throw new Error("Error: transaction not found");
    if (transactionData.payer_id !== user.id && transactionData.recipient_id !== user.id) {
        redirect("/dashboard");
    }
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
                <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Edit Transaction
                </h1>
                <TransactionForm
                    userId={user.id}
                    currency={currency ?? "USD"}
                    balanceInCents={balanceInCents}
                    remainingSpendingLimitInCents={remainingSpendingLimitInCents}
                    transactionId={params.transaction_id}
                    prevTransactionData={transactionData}
                    userBudgetData={userBudgetData}
                />
            </div>
        </main>
    )
}