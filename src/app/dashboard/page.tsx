import OverviewCards from "@/components/dashboard/overview-cards";
import TransactionChart from "@/components/dashboard/transaction-chart";
import ExpenseBreakdownCard from "@/components/dashboard/expense-breakdown-card";
import OverviewCardsSkeleton from "@/ui/skeletons/cards-skeleton";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard - PennyWise",
};

export default async function Dashboard() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }
    const { data: userData, error } = await supabase
        .from("users")
        .select("username")
        .eq("user_id", user.id)
        .limit(1);
    if (error) throw error;
    const username = userData[0].username || "user";

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <p className="my-8 text-2xl font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                    Welcome, {username} 👋
                </p>
                <h1 className="my-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Dashboard
                </h1>
                <section className="grid gap-x-6 gap-y-6 max-md:gap-x-3 grid-cols-3 max-lg:grid-cols-2 my-6">
                    <Suspense fallback={<OverviewCardsSkeleton />} >
                        <OverviewCards
                            supabaseClient={supabase}
                            userId={user.id}
                        />
                    </Suspense>
                    <TransactionChart />
                    <ExpenseBreakdownCard />
                </section>
            </div>
        </main>
    );
}