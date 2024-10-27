"use client";

import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { baseUrl, transactionCategories } from "@/lib/utils/constant";
import { transactionErrorMessage } from "@/lib/utils/helper";
import { formatCurrency, formatCurrencyAmount } from "@/lib/utils/format";
import { RouteHandlerResponse } from "@/lib/types/data";
import { TransactionFormState, TransactionFormData, BudgetFormData } from "@/lib/types/form-state";
import { TransactionType, TransactionCategoryId } from "@/lib/types/transactions";
import { createTransaction, updateTransaction } from "@/lib/actions/transaction";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

export default function TransactionForm({
    userId,
    currency,
    balanceInCents,
    remainingSpendingLimitInCents,
    transactionId,
    prevTransactionData,
    userBudgetData,
}: {
    userId: string,
    currency: string,
    balanceInCents: number,
    remainingSpendingLimitInCents: number | null,
    transactionId?: string,
    prevTransactionData?: TransactionFormData,
    userBudgetData?: BudgetFormData[],
}) {
    const { toast } = useToast();

    const [ descriptionTextboxWidth, setDescriptionTextboxWidth ] = useState<number>(0);
    const [ titlePlaceholder, setTitlePlaceholder ] = useState<string>("My new transaction 💲");
    const [ amountInCents, setAmountInCents ] = useState<number | null>(0);
    const [ deductedSpendingLimitInCents, setDeductedSpendingLimitInCents ] = useState<number>(0);
    const [ type, setType ] = useState<TransactionType>(prevTransactionData?.transaction_type ?? "Deposit");
    const [ userBudgets, setUserBudgets ] = useState<BudgetFormData[]>(userBudgetData ?? []);
    const [ budgetId, setBudgetId ] = useState<string | null | undefined>(prevTransactionData?.budget_id ?? null);
    const [ remainingBudgetAmountInCents, setRemainingBudgetAmountInCents ] = useState<number>(0);
    const [ deductedBudgetAmountInCents, setDeductedBudgetAmountInCents ] = useState<number>(0);
    const [ categoryId, setCategoryId ] = useState<TransactionCategoryId | null>(null);
    

    const getTitlePlaceholder = useCallback((type: TransactionType) => {
        return type === "Deposit"
            ? "My first paycheck 💵"
            : categoryId && (categoryId satisfies TransactionCategoryId)
            ? transactionCategories[categoryId].titlePlaceholder
            : "My new transaction 💲";
    }, [categoryId]);

    const getRemainingBudgetAmount = useCallback(async (budgetId: string | null) => {
        if (!budgetId) {
            setRemainingBudgetAmountInCents(0);
            return;
        }
        for (const budget of userBudgets) {
            if (budget.budget_id !== budgetId) continue;
            const budgetAmount = budget.amount;
            const currDateTime = new Date();
            const monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
            const res = await fetch(
                `${baseUrl}/api/budget/${budgetId}/amount-spent?from=${monthStartDateTime.toISOString()}&to=${currDateTime.toISOString()}`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
            } else {
                const { data: { spentBudget } } = await res.json() as { data: { spentBudget: number } };
                const remainingBudget = budgetAmount - spentBudget;
                let deductedBudget = amountInCents !== null ? remainingBudget - amountInCents : remainingBudget;
                if (prevTransactionData && prevTransactionData.budget_id !== budgetId) {
                    deductedBudget -= amountInCents !== prevTransactionData.amount ? prevTransactionData.amount : -amountInCents;
                }
                setRemainingBudgetAmountInCents(Math.min(budgetAmount, remainingBudget));
                setDeductedBudgetAmountInCents(Math.min(budgetAmount, deductedBudget));
            }
            break;
        }
    }, [prevTransactionData, userBudgets, amountInCents]);

    const handleSubmit = useCallback(async (prevState: TransactionFormState | undefined, formData: FormData) => {
        const formAction = prevTransactionData ? updateTransaction : createTransaction;
        const formState = await formAction(prevState, formData);
        if (formState?.error || formState?.message) {
            console.error(formState.message);
        } else {
            toast({
                title: `${prevTransactionData ? "Update" : "Add"} successful!`,
                description: `Your transaction has been successfully ${prevTransactionData ? "updated" : "added"}.`,
            });
        }
        return formState;
    }, [prevTransactionData]);

    const handleAmountChange = useDebouncedCallback((amount: string) => {
        let inputAmountInCents = Math.floor(parseFloat(amount) * 100);
        if (prevTransactionData) {
            if (isNaN(inputAmountInCents)) inputAmountInCents = 0;
            const netAmountInCents = inputAmountInCents - prevTransactionData.amount;
            inputAmountInCents = prevTransactionData.transaction_type === "Deposit" ? -netAmountInCents : netAmountInCents;
        }
        setAmountInCents(!isNaN(inputAmountInCents) ? inputAmountInCents : null);
        if (remainingSpendingLimitInCents) {
            const deductedLimit = remainingSpendingLimitInCents - inputAmountInCents;
            setDeductedSpendingLimitInCents(!isNaN(deductedLimit) ? deductedLimit : remainingSpendingLimitInCents);
        }
        if (budgetId && remainingBudgetAmountInCents) {
            let deductedBudget = remainingBudgetAmountInCents - inputAmountInCents;
            if (prevTransactionData && prevTransactionData?.budget_id !== budgetId) {
                deductedBudget -= prevTransactionData?.amount;
            }
            setDeductedBudgetAmountInCents(!isNaN(deductedBudget) ? deductedBudget : remainingBudgetAmountInCents);
        }
    }, 300);

    useEffect(() => {
        setDescriptionTextboxWidth(window.innerWidth);
        if (remainingSpendingLimitInCents) {
            setDeductedSpendingLimitInCents(remainingSpendingLimitInCents);
        }
        if (prevTransactionData) {
            setAmountInCents(0);
            if (prevTransactionData.transaction_type !== "Deposit") {
                setCategoryId(prevTransactionData.category_id as TransactionCategoryId);
            }
        }
    }, []);

    useEffect(() => {
        const fetchUserBudgets = async () => {
            const res = await fetch(`${baseUrl}/api/budget?userId=${userId}`, { cache: "no-store" });
            if (res.status !== 200) {
                console.error(res.statusText);
            } else {
                const { data: userBudgetData } = await res.json() as RouteHandlerResponse<BudgetFormData[]>;
                if (userBudgetData) {
                    setUserBudgets(userBudgetData);
                }
            }
        };
        if (userBudgetData) return;
        fetchUserBudgets();
    }, [userId]);

    useEffect(() => {
        getRemainingBudgetAmount(budgetId ?? null);
    }, [budgetId, userBudgets]);

    useEffect(() => {
        setTitlePlaceholder(getTitlePlaceholder(type));
    }, [type, categoryId]);

    const [ error, dispatch ] = useFormState(handleSubmit, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col mt-6 mb-2 max-md:mt-4"
        >
            <input
                id="transaction_id"
                name="transaction_id"
                type="hidden"
                value={transactionId}
            />
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
                defaultValue={prevTransactionData?.title}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder={`e.g., ${titlePlaceholder}`}
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
                defaultValue={prevTransactionData ? formatCurrencyAmount(prevTransactionData.amount) : undefined}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Enter transaction amount (e.g., 100)"
                min={0}
                step={0.01}
                onChange={(e) => handleAmountChange(e.target.value)}
                required
            />
            <input
                id="prev_amount"
                name="prev_amount"
                type="hidden"
                value={prevTransactionData?.amount}
            />
            <input
                id="balance"
                name="balance"
                type="hidden"
                value={balanceInCents}
            />
            <input
                id="remaining_spending_limit"
                name="remaining_spending_limit"
                type="hidden"
                value={remainingSpendingLimitInCents ?? undefined}
            />
            <p className={clsx(
                "mt-2 text-xs text-gray-500",
                { "hidden": type === "Deposit" || !remainingSpendingLimitInCents },
            )}>
                <span>Spending limit left: </span>
                <span className={clsx({ "text-rose-600": deductedSpendingLimitInCents < 0 })}>
                    {formatCurrency(deductedSpendingLimitInCents, currency)}
                </span>
            </p>
            <div className={clsx(
                "flex flex-row md:items-center gap-3 mt-6",
                { "hidden": prevTransactionData },
            )}>
                <label
                    htmlFor="type"
                    className="text-lg font-semibold"
                >
                    Transaction type:
                </label>
                <input
                    id="type"
                    name="type"
                    type="hidden"
                    value={type}
                />
                <div className="flex flex-row justify-center items-center border border-slate-300 rounded-md overflow-hidden">
                    {["Deposit", "Expense", "Pay friend"].map((typeName, idx) => {
                        return (
                            <input
                                key={`type_${idx}`}
                                id={`type_${idx}`}
                                name={`type_${idx}`}
                                type="button"
                                value={typeName}
                                className={clsx(
                                    "px-4 py-2 max-md:px-3 max-md:py-1 max-md:text-sm hover:cursor-pointer transition-colors duration-200",
                                    { "bg-blue-500 hover:bg-blue-600 text-white font-semibold": type === typeName },
                                    { "border-x bg-white hover:bg-sky-100 text-gray-800 hover:text-blue-600": type !== typeName },
                                )}
                                onClick={() => setType(typeName as TransactionType)}
                            />
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
                        defaultValue={budgetId ?? ""}
                        className="appearance-none group rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400 disabled:opacity-50"
                        onChange={(e) => setBudgetId(e.target.value || null)}
                    >
                        <option value={""}>Choose a budget...</option>
                        {userBudgets.map((budget, idx) => {
                            return (
                                <option
                                    key={`budget_${idx}`}
                                    value={budget.budget_id}
                                >
                                    {budget.name}
                                </option>
                            )
                        })}
                    </select>
                    <input
                        id="remaining_budget_amount"
                        name="remaining_budget_amount"
                        type="hidden"
                        value={remainingBudgetAmountInCents}
                    />
                    <p className={clsx(
                        "mt-1 text-xs text-gray-500",
                        { "hidden": !budgetId },
                    )}>
                        <span>Budget left: </span>
                        <span className={clsx({ "text-rose-600": deductedBudgetAmountInCents < 0 })}>
                            {formatCurrency(deductedBudgetAmountInCents, currency)}
                        </span>
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
                        disabled={budgetId !== null}
                        defaultValue={prevTransactionData?.category_id || ""}
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
                <div className="flex flex-row justify-end items-center gap-1 mt-3 text-end text-xs text-gray-500">
                    <QuestionMarkCircleIcon className="w-4 h-4" />
                    <span className="hover:cursor-pointer hover:underline">Help</span>
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
                defaultValue={prevTransactionData?.description ?? undefined}
                className="min-h-12 max-h-64 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Write a short message..."
            />
            <p className={clsx(
                "flex flex-row justify-center gap-1 w-full mt-4 text-center text-sm max-md:text-xs text-red-500",
                { "hidden": !error },
            )}>
                <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                {transactionErrorMessage(error)}
            </p>
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