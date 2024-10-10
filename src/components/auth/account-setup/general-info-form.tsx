"use client";

import { countryCodes } from "@/lib/utils/constant";
import { AccountSetupFormData } from "@/lib/types/form-state";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";

export default function GeneralInfoForm({
    prevFormData,
    handleUpdateFormData,
    handleSubmitFormData,
    handleStepChange,
}: {
    prevFormData: AccountSetupFormData,
    handleUpdateFormData: (data: AccountSetupFormData) => void,
    handleSubmitFormData: (data: AccountSetupFormData) => Promise<void>,
    handleStepChange: (step: 1 | 2 | 3) => void,
}) {
    const handleSumbit = async (
        prevState: { message: string } | undefined,
        formData: FormData,
    ) => {
        try {
            const country = formData.get("country")?.toString();
            if (!country) {
                return { message: "Please select your country" };
            }
            const updatedFormData = {
                first_name: formData.get("firstName")?.toString(),
                last_name: formData.get("lastName")?.toString(),
                country: country,
            };
            await handleSubmitFormData(updatedFormData);
            handleUpdateFormData(updatedFormData);
            handleStepChange(2);
        } catch (error) {
            return { message: "An error has occurred. Please try again" };
        }
    };

    const [error, dispatch] = useFormState(handleSumbit, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col justify-between max-md:gap-6 md:border-l border-gray-500 border-dashed w-full h-full min-h-[300px] md:px-6 py-3"
        >
            <section className="flex flex-col">
                <label
                    htmlFor="firstName"
                    className="mb-1 text-sm font-semibold"
                >
                    First name
                </label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                    placeholder="Enter your first name here"
                    defaultValue={prevFormData?.first_name || ""}
                    required
                />
                <label
                    htmlFor="lastName"
                    className="mt-4 mb-1 max-md:mt-3 text-sm font-semibold"
                >
                    Last name
                </label>
                <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                    placeholder="Enter your last name here"
                    defaultValue={prevFormData?.last_name || ""}
                    required
                />
                <label
                    htmlFor="country"
                    className="mt-4 mb-1 max-md:mt-3 text-sm font-semibold"
                >
                    Where are you from?
                </label>
                <div className="relative w-full">
                    <select
                        id="country"
                        name="country"
                        defaultValue={prevFormData?.country || ""}
                        className="appearance-none rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400"
                    >
                        <option value={""}>Choose a country...</option>
                        {Object.entries(countryCodes).map(([code, country], index) => {
                            return (
                                <option
                                    key={code}
                                    value={code}
                                >
                                    {country}
                                </option>
                            )
                        })}
                    </select>
                    <ChevronDownIcon className="absolute top-2 right-2.5 w-4 h-4 text-gray-500" />
                </div>
                <p className={clsx(
                    "flex flex-row justify-center gap-1 w-full max-md:w-full mt-4 text-center text-sm max-md:text-xs text-red-500",
                    { "hidden": !error }
                )}>
                    <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                    {error?.message}
                </p>
            </section>
            <NextButton />
        </form>
    )
}

function NextButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="self-end w-20 max-md:w-16 p-2 border-0 rounded-lg text-white max-md:text-sm font-semibold hover:cursor-pointer bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Next
        </button>
    )
}