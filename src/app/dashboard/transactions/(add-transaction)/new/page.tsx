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
    const { data: userData, error } = await supabase
        .from("users")
        .select("currency, balance, spending_limit")
        .eq("user_id", user.id)
        .limit(1);
    if (error) throw error;
    const {
        currency,
        balance: balanceInCents,
        spending_limit: spendingLimitInCents,
    }: {
        currency: string,
        balance: number,
        spending_limit: number | null,
    } = userData[0];

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
                    spendingLimitInCents={spendingLimitInCents}
                />
            </div>
        </main>
    )
}