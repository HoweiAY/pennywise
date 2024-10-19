import AddTransactionForm from "@/components/dashboard/transactions/add-transaction-form";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "New Transaction - PennyWise",
}

export default async function AddTransaction() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }
    const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("currency, balance, spending_limit")
        .eq("user_id", user.id)
        .limit(1);
    if (userDataError) throw userDataError;
    const { currency, balance: balanceInCents }: { currency: string, balance: number } = userData[0];
    
    let remainingSpendingLimitInCents = userData[0].spending_limit;
    if (remainingSpendingLimitInCents) {
        const currDateTime = new Date();
        const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
        const { data: transactionSumData, error: transactionSumError } = await supabase
            .from("transactions")
            .select("spentLimit:amount.sum()")
            .eq("payer_id", user.id)
            .lt("updated_at", currDateTime.toISOString())
            .gte("updated_at", monthStartDateTime.toISOString());
        if (!transactionSumError && transactionSumData.length > 0) {
            remainingSpendingLimitInCents -= transactionSumData[0].spentLimit as number;
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
                <AddTransactionForm
                    userId={user.id}
                    currency={currency}
                    balanceInCents={balanceInCents}
                    remainingSpendingLimitInCents={remainingSpendingLimitInCents}
                />
            </div>
        </main>
    )
}