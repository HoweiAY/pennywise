import BudgetForm from "@/components/dashboard/budget/budget-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Budget - PennyWise",
};

export default async function CreateBudget() {
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
                <BudgetForm />
            </div>
        </main>
    )
}