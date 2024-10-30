import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/data/auth";
import { getUserBalanceData } from "@/lib/data/user";
import { getTransactionById, getTotalTransactionAmount } from "@/lib/data/transaction";
import { getUserBudgets } from "@/lib/data/budget";
import { TransactionFormData } from "@/lib/types/form-state";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit Transaction - PennyWise",
}

export default async function EditTransaction({ params }: { params: { transaction_id: string } }) {
    const { user } = await getAuthUser();
    const transactionAndBalanceData = await Promise.all([
        getTransactionById(params.transaction_id, true),
        getUserBalanceData(user.id),
        getUserBudgets(user.id),
    ]);
    const [
        { status: transactionStatus, message: transactionMessage, data: transactionData },
        { status: userBalanceStatus, message: userBalanceMessage, data: userBalanceData },
        { status: userBudgetStatus, message: userBudgetMessage, data: userBudgetData },
    ] = transactionAndBalanceData;

    if (transactionStatus !== "success" || !transactionData) {
        throw new Error(transactionMessage || "Error: transaction not found");
    }
    const userTransactionData = transactionData["transactionData"] as TransactionFormData;
    if (userTransactionData.payer_id !== user.id && userTransactionData.recipient_id !== user.id) {
        redirect("/dashboard");
    }
    if (userTransactionData.transaction_type === "Pay friend") {
        redirect("/dashboard/transactions");
    }
    
    if (userBalanceStatus !== "success" || !userBalanceData) {
        throw new Error(userBalanceMessage || "Error: user balance information not found");
    }
    let {
        currency, 
        balance: balanceInCents,
        spending_limit: remainingSpendingLimitInCents,
    } = userBalanceData["userBalanceData"];

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

    if (userBudgetStatus !== "success") {
        console.error(userBudgetMessage);
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
                    prevTransactionData={userTransactionData ?? undefined}
                    userBudgetData={userBudgetData ? userBudgetData["userBudgetData"] : undefined}
                />
            </div>
        </main>
    )
}