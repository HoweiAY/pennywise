"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { budgetCategories } from "@/lib/utils/constant";
import { budgetErrorMessage } from "@/lib/utils/helper";
import { createBudget, updateBudget } from "@/lib/actions/budget";
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import clsx from "clsx";

export default function BudgetForm({
    currency,
    budgetId,
}: {
    currency: string,
    budgetId?: string,
}) {
    const [ descriptionTextboxWidth, setDescriptionTextboxWidth ] = useState<number>(0);

    useEffect(() => {
        setDescriptionTextboxWidth(window.innerWidth);
    }, []);

    const [ error, dispatch ] = useFormState(budgetId ? updateBudget : createBudget, undefined);
    
    return (
        <form
            action={dispatch}
            className="flex flex-col mt-6 mb-2 max-md:mt-4"
        >
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
                        defaultValue={""}
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
                    href={"/dashboard/budget"}
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