"use client";

import { currencyData } from "@/lib/utils/constant";
import { formatCurrencySymbol } from "@/lib/utils/format";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { AccountSetupFormState } from "@/lib/types/form-state";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";

export default function BalanceBudgetForm({
    formData,
    handleUpdateFormData,
    handleSubmitFormData,
    handleStepChange,
}: {
    formData: AccountSetupFormState,
    handleUpdateFormData: (data: AccountSetupFormState) => void,
    handleSubmitFormData: (data: AccountSetupFormState) => Promise<void>,
    handleStepChange: (step: 1 | 2 | 3) => void,
}) {
    const handleSumbit = async (
        prevState: { message: string } | undefined,
        formData: FormData,
    ) => {
        try {
            const currency = formData.get("currency")?.toString();
            if (!currency) {
                return { message: "Please select your currency" };
            }
            const balance = formData.get("balance") as number | null;
            const spendingLimit = formData.get("spendingLimit") as number | null;
            if (!balance) {
                return { message: "Please enter your current balance" };
            }
            if (balance <= 0) {
                return { message: "Please enter a balance amount greater than 0" };
            }
            if (spendingLimit && spendingLimit <= 0) {
                return { message: "Please enter a spending limit greater than 0" };
            }
            const balanceInCents = Math.floor(balance * 100);
            const spendingLimitInCents = spendingLimit && Math.floor(spendingLimit * 100);
            const updatedFormData = {
                currency,
                balance: balanceInCents,
                spending_limit: spendingLimitInCents || null,
            };
            console.log(updatedFormData);
            //await handleSubmitFormData(updatedFormData);
            handleUpdateFormData(updatedFormData);
            //handleStepChange(3);
        } catch (error) {
            return { message: "An error has occurred, please try again" };
        }
    };

    const [ error, dispatch ] = useFormState(handleSumbit, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col justify-between max-md:gap-6 md:border-l border-gray-500 border-dashed w-full h-full min-h-[300px] md:px-6 py-3"
        >
            <section className="flex flex-col">
                <label
                    htmlFor="currency"
                    className="mt-2 mb-1 text-sm font-semibold"
                >
                    Which currency do you use?
                </label>
                <div className="relative w-full">
                    <select
                        id="currency"
                        name="currency"
                        defaultValue={formData?.currency || ""}
                        className="appearance-none rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400"
                    >
                        <option value={""}>Choose a currency...</option>
                        {Object.entries(currencyData).map(([code, currency], index) => {
                            return (
                                <option
                                    key={code}
                                    value={code}
                                >
                                    {`${code} - ${currency} (${formatCurrencySymbol(code)})`}
                                </option>
                            )
                        })}
                    </select>
                    <ChevronDownIcon className="absolute top-2 right-2.5 w-4 h-4 text-gray-500" />
                </div>
                <label
                    htmlFor="balance"
                    className="mt-4 mb-1 max-md:mt-3 text-sm font-semibold"
                >
                    What is your current balance?
                </label>
                <input
                    id="balance"
                    name="balance"
                    type="number"
                    className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                    placeholder="Enter balance amount"
                    defaultValue={formData?.balance || ""}
                    min={0}
                    step={0.01}
                    required
                />
                <label
                    htmlFor="spendingLimit"
                    className="mt-4 mb-1 max-md:mt-3 text-sm font-semibold"
                >
                    Set a monthly spending limit (optional)
                </label>
                <input
                    id="spendingLimit"
                    name="spendingLimit"
                    type="number"
                    className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                    placeholder="Enter your spending limit (optional)"
                    defaultValue={formData?.spending_limit || ""}
                    min={0}
                    step={0.01}
                />
                <p className={clsx(
                    "flex flex-row justify-center gap-1 w-full max-md:w-full mt-4 text-center text-sm max-md:text-xs text-red-500",
                    { "hidden": !error }
                )}>
                    <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                    {error?.message}
                </p>
            </section>
            <div className="flex flex-row justify-between w-full">
                <div 
                    className="w-24 max-md:w-20 p-2 border rounded-lg text-center max-md:text-sm font-semibold bg-gray-50 hover:bg-sky-100 hover:text-blue-600 hover:cursor-pointer shadow-md shadow-slate-300 duration-200"
                    onClick={() => handleStepChange(1)}
                >
                    Previous
                </div>
                <NextButton /> 
            </div>
        </form>
    )
}

function NextButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="w-20 max-md:w-16 p-2 border-0 rounded-lg text-white max-md:text-sm font-semibold hover:cursor-pointer bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Next
        </button>
    )
}