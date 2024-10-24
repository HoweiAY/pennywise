import BudgetForm from "@/components/dashboard/budget/budget-form";
import { getAuthUser } from "@/lib/actions/auth";
import { getUserBudgetById } from "@/lib/actions/budget";
import { BudgetFormData } from "@/lib/types/form-state";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Edit Budget - PennyWise",
};

export default async function EditBudget({ params }: { params: { budget_id: string } }) {
    const { user } = await getAuthUser();
    const { status, message, data } = await getUserBudgetById(params.budget_id);
    if (status !== "success" || !data) {
        throw new Error(message || "Error: budget not found");
    }
    const budgetData = data["budgetData"];
    if (budgetData.user_id !== user.id) {
        redirect("/dashboard");
    }

    return (
        <main className="h-fit mb-2 overflow-hidden">
            <div className="px-6">
            <h1 className="mt-8 pb-1 text-3xl max-md:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                Edit budget
            </h1>
            <BudgetForm
                currency={budgetData.currency}
                budgetId={params.budget_id}
                prevBudgetData={budgetData}
            />
            </div>
        </main>
    )
}