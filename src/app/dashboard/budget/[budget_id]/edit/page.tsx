import BudgetForm from "@/components/dashboard/budget/budget-form";
import { BudgetFormData } from "@/lib/types/form-state";
import { createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit Budget - PennyWise",
};

export default async function EditBudget({ params }: { params: { budget_id: string } }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }
    const { data: budgetData, error } = await supabase
        .from("budgets")
        .select("name, category_id, currency, amount, user_id, description")
        .eq("budget_id", params.budget_id)
        .limit(1);
    if (error) throw error;
    const prevBudgetData: BudgetFormData = budgetData[0];
    if (prevBudgetData.user_id !== user.id) {
        redirect("/dashboard");
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
            <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                Edit budget
            </h1>
            <BudgetForm
                currency={prevBudgetData.currency}
                budgetId={params.budget_id}
                prevBudgetData={prevBudgetData}
            />
            </div>
        </main>
    )
}