import OverviewCards from "@/components/dashboard/overview-cards";
import DashboardChartContainer from "@/components/dashboard/dashboard-chart-container";
import OverviewCardsSkeleton from "@/ui/skeletons/overview-cards-skeleton";
import DashboardChartSkeleton from "@/ui/skeletons/dashboard-chart-skeleton";
import { getAuthUser } from "@/lib/data/auth";
import { getUserDataById, getUserBalanceData } from "@/lib/data/user";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard - PennyWise",
};

export default async function Dashboard() {
    const { user } = await getAuthUser();
    const [
        { status: userDataStatus, message: userDataMessage, data: userData },
        { status: userBalanceStatus, message: userBalanceMessage, data: userBalanceData },
    ] = await Promise.all([
        getUserDataById(user.id),
        getUserBalanceData(user.id),
    ]);
    if (userDataStatus !== "success" || !userData) {
        throw new Error(userDataMessage || "Failed to fetch user data");
    }
    if (userBalanceStatus !== "success") {
        console.error(userBalanceMessage || "Failed to fetch user balance information");
    }
    const username = userData["userData"].username || "user";
    const currency = userBalanceData ? userBalanceData["userBalanceData"].currency : "USD";

    return (
        <main className="h-fit max-md:min-h-screen mb-2 overflow-hidden">
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
                            userId={user.id}
                            userBalanceData={userBalanceData ? userBalanceData["userBalanceData"] : null}
                        />
                    </Suspense>
                    <Suspense fallback={<DashboardChartSkeleton />}>
                        <DashboardChartContainer
                            title="Transactions overview"
                            type="transaction-chart"
                            userId={user.id}
                            currency={currency}
                            colSpan={2}
                        />
                        <DashboardChartContainer
                            title="Expense breakdown"
                            type="expense-breakdown-chart"
                            userId={user.id}
                            currency={currency}
                        />
                    </Suspense>
                </section>
            </div>
        </main>
    );
}