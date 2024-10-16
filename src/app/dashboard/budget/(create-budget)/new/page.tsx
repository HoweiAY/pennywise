import BudgetForm from "@/components/dashboard/budget/budget-form";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "New Budget - PennyWise",
};

export default async function CreateBudget() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }
    const { data: userData, error } = await supabase
        .from("users")
        .select("currency")
        .eq("user_id", user.id)
        .limit(1);
    if (error) throw error;
    const { currency }: { currency: string } = userData[0];

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
                <header>
                    <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                        New budget
                    </h1>
                    <p className="mt-1 mb-2 md:me-4 max-md:my-1 max-md:text-sm text-gray-500">
                        Set up a budget to plan your finance more effectively
                    </p>
                </header>
                <BudgetForm currency={currency} />
            </div>
        </main>
    )
}