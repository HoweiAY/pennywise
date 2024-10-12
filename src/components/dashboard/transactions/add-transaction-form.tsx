"use client";

import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { transactionCategories } from "@/lib/utils/constant";
import { TransactionType, TransactionCategoryId } from "@/lib/types/transactions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";

export default function AddTransactionForm() {
    const [ descriptionTextboxWidth, setDescriptionTextboxWidth ] = useState<number>(0);
    const [ titlePlaceholder, setTitlePlaceholder ] = useState<string>("My new transaction 💲");
    const [ type, setType ] = useState<TransactionType>("Deposit");
    const [ categoryId, setCategoryId ] = useState<TransactionCategoryId | null>(null);

    const getTitlePlaceholder = (type: "Deposit" | "Expense" | "Pay friend") => {
        return type === "Deposit"
            ? "My first paycheck 💵"
            : categoryId && (categoryId satisfies TransactionCategoryId)
            ? transactionCategories[categoryId].titlePlaceholder
            : "My new transaction 💲";
    };

    const handleSumbit = async (
        prevState: { message: string } | undefined,
        formData: FormData,
    ) => {
        return undefined;
    };

    useEffect(() => {
        setDescriptionTextboxWidth(window.innerWidth);  
    }, []);

    useEffect(() => {
        setTitlePlaceholder(getTitlePlaceholder(type));
    }, [type, categoryId]);

    const [ error, dispatch ] = useFormState(handleSumbit, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col mt-6 mb-2 max-md:mt-4"
        >
            <label
                htmlFor="title"
                className="mt-2 mb-1 text-lg font-semibold"
            >
                Title
            </label>
            <input
                id="title"
                name="title"
                type="text"
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder={`e.g., ${titlePlaceholder}`}
                required
            />
            <label
                htmlFor="amount"
                className="mt-4 mb-1 text-lg font-semibold"
            >
                {`Amount (in ${"USD"})`}
            </label>
            <input
                id="amount"
                name="amount"
                type="number"
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Enter transaction amount (e.g., 100)"
                min={0}
                step={0.01}
                required
            />
            <p className={clsx(
                "mt-2 text-xs text-gray-500",
                { "hidden": type === "Deposit" },
            )}>
                Spending limit left: <span>$ --</span>
            </p>
            <div className="flex flex-row md:items-center gap-3 mt-6">
                <label
                    htmlFor="type"
                    className="text-lg font-semibold"
                >
                    Transaction type:
                </label>
                <input
                    id="type"
                    name="type"
                    type="text"
                    value={type}
                    onChange={(e) => e.target.value = type}
                    className="hidden"
                />
                <div className="flex flex-row justify-center items-center border border-slate-300 rounded-md overflow-hidden">
                    {["Deposit", "Expense", "Pay friend"].map((typeName, idx) => {
                        return (
                            <div
                                key={`type_${idx}`}
                                tabIndex={0}
                                className={clsx(
                                    "px-4 py-2 max-md:px-3 max-md:py-1 max-md:text-sm hover:cursor-pointer transition-colors duration-200",
                                    { "bg-blue-500 hover:bg-blue-600 text-white font-semibold": type === typeName },
                                    { "border-x bg-white hover:bg-sky-100 text-gray-800 hover:text-blue-600": type !== typeName },
                                )}
                                onKeyDown={(e) => e.key === "Enter" && setType(typeName as TransactionType)}
                                onClick={() => setType(typeName as TransactionType)}
                            >
                                {typeName}
                            </div>
                        )
                    })}
                </div>
            </div>
            <section className={clsx(
                "border border-slate-100 rounded-md w-1/2 max-lg:w-3/4 max-md:w-full px-4 pt-3 pb-4 my-4 bg-gray-100 shadow-lg",
                { "hidden": type === "Deposit" },
            )}>
                <div className="relative flex flex-col gap-y-1 w-full">
                    <label
                        htmlFor="budget"
                        className="text-lg font-semibold"
                    >
                        Budget
                    </label>
                    <select
                        id="budget"
                        name="budget"
                        disabled={categoryId !== null}
                        className="appearance-none group rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
                        onChange={(e) => console.log(e.target.value)}
                    >
                        <option value={""}>Choose a budget...</option>
                    </select>
                    <p className={clsx(
                        "mt-1 text-xs text-gray-500",
                        { "hidden": type === "Deposit" },
                    )}>
                        Budget left: <span>$ --</span>
                    </p>
                    <ChevronDownIcon className="absolute top-10 right-2.5 w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-row justify-between items-center w-full mt-2 text-center">
                    <hr className="w-[45%] border-gray-300"/>
                    <span className="text-gray-500 max-md:text-sm">or</span>
                    <hr className="w-[45%] border-gray-300"/>
                </div>
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
                        defaultValue={categoryId || ""}
                        className="appearance-none group rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
                        onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) as TransactionCategoryId : null)}
                    >
                        <option value={""}>Choose a category...</option>
                        {Object.entries(transactionCategories).map(([id, categoryData], idx) => {
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
                <div className="flex flex-row justify-end items-center gap-1 mt-3 text-end text-xs text-gray-500 hover:cursor-pointer">
                    <QuestionMarkCircleIcon className="w-4 h-4" />
                    <span>Help</span>
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
                placeholder="Write a short message..."
            />
            <div className="flex flex-row justify-between items-center my-6">
                <Link
                    href={"/dashboard/transactions"}
                    className="border rounded-md px-4 py-2 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200"
                >
                    Cancel
                </Link>
                <ConfirmAddButton />
            </div>
        </form>
    )
}

function ConfirmAddButton() {
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