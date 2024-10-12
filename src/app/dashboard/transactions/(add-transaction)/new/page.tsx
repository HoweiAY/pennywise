import AddTransactionForm from "@/components/dashboard/transactions/add-transaction-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Transaction - PennyWise",
}

export default function AddTransaction() {
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
                <AddTransactionForm />
            </div>
        </main>
    )
}