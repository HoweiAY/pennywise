"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { BudgetFormState, BudgetFormData } from "@/lib/types/form-state";
import { budgetCategories } from "@/lib/utils/constant";
import { budgetErrorMessage } from "@/lib/utils/helper";
import { formatCurrencyAmount } from "@/lib/utils/format";
import { createBudget, updateBudget } from "@/lib/actions/budget";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

export default function BudgetForm({
    currency,
    budgetId,
    prevBudgetData,
}: {
    currency: string,
    budgetId?: string,
    prevBudgetData?: BudgetFormData,
}) {
    const { toast } = useToast();

    const [ descriptionTextboxWidth, setDescriptionTextboxWidth ] = useState<number>(0);

    const handleSubmit = useCallback(async (prevState: BudgetFormState | undefined, formData: FormData) => {
        const formAction = budgetId && prevBudgetData ? updateBudget : createBudget;
        const formState = await formAction(prevState, formData);
        if (formState?.error || formState?.message) {
            console.error(formState.message);
        } else {
            toast({
                title: `${budgetId && prevBudgetData ? "Update" : "Add"} successful!`,
                description: `Your budget has been successfully ${budgetId && prevBudgetData ? "updated" : "added"}.`,
            });
        }
        return formState;
    }, [budgetId, prevBudgetData]);

    useEffect(() => {
        setDescriptionTextboxWidth(window.innerWidth);
    }, []);

    const [ error, dispatch ] = useFormState(handleSubmit, undefined);
    
    return (
        <form
            action={dispatch}
            className="flex flex-col mt-6 mb-2 max-md:mt-4"
        >
            <input
                id="budget_id"
                name="budget_id"
                type="hidden"
                value={budgetId}
            />
            <label
                htmlFor="name"
                className="mt-2 mb-1 text-lg font-semibold"
            >
                Budget name
            </label>
            <input
                id="name"
                name="name"
                type="text"
                defaultValue={prevBudgetData?.name}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="e.g., My new budget 💹"
                required
            />
            <input
                id="currency"
                name="currency"
                type="hidden"
                value={currency}
            />
            <label
                htmlFor="amount"
                className="mt-4 mb-1 text-lg font-semibold"
            >
                {`Amount (in ${currency})`}
            </label>
            <input
                id="amount"
                name="amount"
                type="number"
                defaultValue={prevBudgetData?.amount ? formatCurrencyAmount(prevBudgetData.amount) : undefined}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Set a budget limit (e.g., 500)"
                min={0}
                step={0.01}
                required
            />
            <section className="border border-slate-100 rounded-md w-1/2 max-lg:w-3/4 max-md:w-full px-4 pt-3 pb-4 my-4 bg-gray-100 shadow-lg duration-200">
                <div className="relative flex flex-col gap-y-1 w-full">
                    <label
                        htmlFor="category"
                        className="text-lg font-semibold"
                    >
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={prevBudgetData?.category_id}
                        className="appearance-none group rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400"
                    >
                        <option value={""}>Choose a category...</option>
                        {Object.entries(budgetCategories).map(([id, categoryData], idx) => {
                            return (
                                <option
                                    key={`category_${id}`}
                                    value={id}
                                >
                                    {categoryData.name}
                                </option>
                            )
                        })}
                    </select>
                    <ChevronDownIcon className="absolute top-10 right-2.5 w-4 h-4 text-gray-500" />
                </div>
            </section>
            <label
                htmlFor="description"
                className="mt-4 mb-1 text-lg font-semibold"
            >
                Description (optional)
            </label>
            <textarea
                id="description"
                name="description"
                rows={5}
                cols={descriptionTextboxWidth}
                defaultValue={prevBudgetData?.description ?? undefined}
                className="min-h-12 max-h-64 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Write a brief description about your budget plan..."
            />
            <p className={clsx(
                "flex flex-row justify-center gap-1 w-full mt-4 text-center text-sm max-md:text-xs text-red-500",
                { "hidden": !error },
            )}>
                <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                {budgetErrorMessage(error)}
            </p>
            <div className="flex flex-row justify-between items-center my-6">
                <Link
                    href={"/dashboard/budget/my-budgets"}
                    className="border rounded-md px-4 py-2 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200"
                >
                    Cancel
                </Link>
                <ConfirmButton />
            </div>
        </form>
    )
}

function ConfirmButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            className="border-0 rounded-md px-4 py-2 text-center text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 shadow-md shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Confirm
        </button>
    )
}