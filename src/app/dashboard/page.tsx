import OverviewCards from "@/components/dashboard/overview-cards";
import TransactionChart from "@/components/dashboard/transaction-chart";
import ExpenseBreakdownCard from "@/components/dashboard/expense-breakdown-card";
import OverviewCardsSkeleton from "@/ui/skeletons/cards-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard - PennyWise",
};

export default async function Dashboard() {
    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <p className="my-8 text-2xl font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                    Welcome, user! 👋
                </p>
                <h1 className="my-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Dashboard
                </h1>
                <section className="grid gap-x-6 gap-y-6 max-md:gap-x-3 grid-cols-3 max-lg:grid-cols-2 my-6">
                    <Suspense fallback={<OverviewCardsSkeleton />} >
                        <OverviewCards />
                    </Suspense>
                    <TransactionChart />
                    <ExpenseBreakdownCard />
                </section>
            </div>
        </main>
    );
}