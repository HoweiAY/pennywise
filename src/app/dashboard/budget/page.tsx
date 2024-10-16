import UserBudgetCardCarousel from "@/components/dashboard/budget/user-budget-card-carousel";
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Budget - PennyWise",
};

export default async function Budget() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <h1 className="mt-8 pb-2 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    Budget
                </h1>
                <section className="flex flex-col items-center w-full py-2 my-2">
                    <div className="flex flex-row justify-between items-center w-full">
                        <h2 className="text-2xl max-md:text-xl font-semibold">
                            Recent Budgets
                        </h2>
                        <Link
                            href={"/dashboard/budget/new"}
                            className="flex flex-row items-center gap-2 max-md:gap-1 border-0 rounded-lg w-fit h-10 px-6 max-md:px-3 text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                            <span className="mr-1 max-md:text-sm">New Budget</span>
                        </Link>
                    </div>
                    <UserBudgetCardCarousel
                        supabaseClient={supabase}
                        userId={user.id}
                    />
                    <Link
                        href={"/dashboard/budget/my-budgets"}
                        className="self-end flex flex-row items-center gap-2 mr-6 max-md:mr-3 md:text-lg font-semibold hover:underline"
                    >
                        View all
                        <ArrowRightIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                    </Link>
                </section>
                <section>
                    <h2 className="text-2xl max-md:text-xl font-semibold">
                        Budget Breakdown
                    </h2>
                </section>
            </div>
        </main>
    )
}