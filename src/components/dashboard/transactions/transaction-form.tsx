"use client";

import avatarDefault from "@/ui/icons/avatar-default.png";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { baseUrl, transactionCategories } from "@/lib/utils/constant";
import { transactionErrorMessage } from "@/lib/utils/helper";
import { formatCurrency, formatCurrencyAmount } from "@/lib/utils/format";
import { RouteHandlerResponse } from "@/lib/types/data";
import { TransactionFormState, TransactionFormData, BudgetFormData } from "@/lib/types/form-state";
import { FriendsData } from "@/lib/types/friend";
import { TransactionType, TransactionCategoryId } from "@/lib/types/transactions";
import { createTransaction, updateTransaction } from "@/lib/actions/transaction";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

export default function TransactionForm({
    userId,
    currency,
    balanceInCents,
    remainingSpendingLimitInCents,
    transactionType,
    transactionId,
    payFriendId,
    prevTransactionData,
    userBudgetData,
}: {
    userId: string,
    currency: string,
    balanceInCents: number,
    remainingSpendingLimitInCents: number | null,
    transactionType?: TransactionType,
    transactionId?: string,
    payFriendId?: string,
    prevTransactionData?: TransactionFormData,
    userBudgetData?: BudgetFormData[],
}) {
    const { toast } = useToast();

    const [ descriptionTextboxWidth, setDescriptionTextboxWidth ] = useState<number>(0);
    const [ titlePlaceholder, setTitlePlaceholder ] = useState<string>("My new transaction 💲");
    const [ amountInCents, setAmountInCents ] = useState<number | null>(0);
    const [ deductedSpendingLimitInCents, setDeductedSpendingLimitInCents ] = useState<number>(0);
    const [ type, setType ] = useState<TransactionType>(prevTransactionData?.transaction_type ?? (transactionType || "Deposit"));
    const [ budgetId, setBudgetId ] = useState<string | null | undefined>(prevTransactionData?.budget_id ?? null);
    const [ remainingBudgetAmountInCents, setRemainingBudgetAmountInCents ] = useState<number>(0);
    const [ deductedBudgetAmountInCents, setDeductedBudgetAmountInCents ] = useState<number>(0);
    const [ categoryId, setCategoryId ] = useState<TransactionCategoryId | null>(null);
    const [ friendId, setFriendId ] = useState<string | undefined>(payFriendId ?? undefined);

    const transactionTypes = useMemo(() => {
        return ["Deposit", "Expense", "Pay friend"] satisfies TransactionType[];
    }, []);

    const { data: userFriends, isFetching: fetchingFriends } = useQuery({
        queryKey: ["friends", userId],
        queryFn: async () => {
            const res = await fetch(
                `${baseUrl}/api/users/${userId}/friends?status=friend`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            }
            const { data: friendsData } = await res.json() as { data: FriendsData[] };
            for (const friend of friendsData) {
                if (friend.inviter_id === friendId) {
                    setFriendId(friend.inviter_id);
                    break;
                }
                if (friend.invitee_id === friendId) {
                    setFriendId(friend.invitee_id);
                    break;
                }
            }
            return friendsData;
        },
        initialData: [],
        refetchOnWindowFocus: false,
    });

    const { data: userBudgets } = useQuery({
        queryKey: ["budgets", userId],
        queryFn: async () => {
            if (userBudgetData) return userBudgetData;
            const res = await fetch(
                `${baseUrl}/api/users/${userId}/budget`,
                { cache: "no-store" },
            );
            if (res.status !== 200) {
                console.error(res.statusText);
                return [];
            } else {
                const { data: userBudgetData } = await res.json() as RouteHandlerResponse<BudgetFormData[]>;
                return userBudgetData ?? [];
            }
        },
        initialData: [],
        refetchOnWindowFocus: false,
    });

    const getTitlePlaceholder = useCallback((type: TransactionType) => {
        return type === "Deposit"
            ? "My first paycheck 💵"
            : categoryId
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

    const handleSelectFriend = useCallback((friendUserId: string) => {
        setFriendId(friendUserId);
    }, []);

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
            if (prevTransactionData.transaction_type !== "Deposit" && prevTransactionData.category_id) {
                setCategoryId(prevTransactionData.category_id satisfies TransactionCategoryId);
            }
        }
    }, []);

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
                    {transactionTypes.map((typeName, idx) => {
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
                                onClick={() => setType(typeName satisfies TransactionType)}
                            />
                        )
                    })}
                </div>
            </div>
            {type === "Pay friend" &&
                <p className="mt-1 max-md:mt-1.5 text-sm max-md:text-xs text-gray-500">
                    * Payment to friends <span className="font-semibold">cannot</span> be edited or deleted
                </p>
            }
            <section className={clsx(
                "border border-slate-100 rounded-md w-1/2 max-lg:w-3/4 max-md:w-full px-4 pt-3 pb-4 my-4 bg-white shadow-md",
                { "hidden": type !== "Pay friend" },
            )}>
                <label
                    htmlFor="friend"
                    className="text-lg font-semibold"
                >
                    Choose friend
                </label>
                <input
                    id="friend_id"
                    name="friend_id"
                    type="hidden"
                    value={friendId}
                />
                <p className="text-sm text-gray-500">
                    Select a friend as the payee
                </p>
                <ul
                    aria-labelledby="friend"
                    className="flex flex-col gap-2 w-full max-h-56 overflow-scroll py-3"
                >
                    {!fetchingFriends && userFriends.map((friendData, idx) => {
                        const friendUserId = friendData.invitee_id === userId ? friendData.inviter_id : friendData.invitee_id;
                        const friendProfile = friendData.invitee_id === userId ? friendData.inviter_data : friendData.invitee_data;
                        return (
                            <li
                                key={`friend_${idx}`}
                                className={`w-full h-16 border-0 rounded-md px-3 ${friendUserId === friendId ? "bg-sky-100 text-blue-600" : "bg-gray-100 hover:bg-gray-200"} hover:cursor-pointer duration-200`}
                                onClick={() => handleSelectFriend(friendUserId)}
                            >
                                <div className="flex flex-row items-center gap-3 h-full md:w-1/2">
                                    <div className="w-10 h-10 min-w-10 border-2 border-gray-700 rounded-full bg-white overflow-clip">
                                        <Image
                                            priority
                                            loader={({ src, width, quality }) => `${src}?w=${width}&q=${quality}`}
                                            src={friendProfile?.avatar_url || avatarDefault.src}
                                            width={40}
                                            height={40}
                                            alt={"User avatar"}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center overflow-hidden">
                                        <p className="whitespace-nowrap font-semibold text-sm text-ellipsis overflow-hidden">
                                            {friendProfile?.username}
                                        </p>
                                        <p className={`whitespace-nowrap ${friendUserId === friendId ? "text-blue-600" : "text-gray-500"} text-xs text-ellipsis overflow-hidden`}>
                                            {friendProfile?.first_name && friendProfile.last_name
                                                ? `${friendProfile?.first_name} ${friendProfile.last_name}`
                                                : `${friendProfile?.email}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    {!fetchingFriends && userFriends.length === 0 &&
                        <div className="flex justify-center items-center border-0 rounded-md w-full h-24 bg-gray-100 text-center">
                            <p className="font-semibold max-md:text-sm">
                                Friend list empty
                            </p>
                        </div>
                    }
                    {fetchingFriends &&
                        <div className="animate-pulse flex flex-col gap-2 w-full max-h-56 overflow-scroll py-3">
                            <div className="border-0 rounded-md w-full h-16 bg-gray-300 text-center" />
                            <div className="border-0 rounded-md w-full h-16 bg-gray-300 text-center" />
                            <div className="border-0 rounded-md w-full h-16 bg-gray-300 text-center" />
                        </div>
                    }
                </ul>
            </section>
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