import TransactionForm from "@/components/dashboard/transactions/transaction-form";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBalanceData } from "@/lib/actions/user";
import { getTransactionById, getTotalTransactionAmount } from "@/lib/actions/transaction";
import { getUserBudgets } from "@/lib/actions/budget";
import { BudgetFormData, TransactionFormData } from "@/lib/types/form-state";
import { UserBalanceData } from "@/lib/types/user";
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
        { status: transactionStatus, message: transactionMessage, data: transactionData },
        { status: userBalanceStatus, message: userBalanceMessage, data: userBalanceData },
        { status: userBudgetStatus, message: userBudgetMessage, data: userBudgetData },
    ] = transactionAndBalanceData;

    if (transactionStatus !== "success" || !transactionData) {
        throw new Error(transactionMessage || "Error: transaction not found");
    }
    const userTransactionData = transactionData["transactionData"];
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
        } = await getTotalTransactionAmount(user.id, "Expenditure", monthStartDateTime, currDateTime);
        if (transactionAmountStatus !== "success") {
            console.error(transactionAmountMessage);
        } else if (transactionAmountData) {
            remainingSpendingLimitInCents -= transactionAmountData["transactionAmount"] as number;
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