"use client";

import { useSearchParams } from "next/navigation";
import clsx from "clsx";

const accountSetupBreadcrumbs = [
    { step: 1, name: "General information", description: "Tell us more about yourself" },
    { step: 2, name: "Balance and budget details", description: "Set up your balance information" },
    { step: 3, name: "???", description: "Sample text" },
];

function getFormTitle(step: string | null) {
    let currStep = step ? parseInt(step) : 1;
    if (isNaN(currStep) || currStep < 1 || currStep > 3) currStep = 1;
    return (
        <div className="flex flex-col mt-6 text-xl font-semibold">
            {accountSetupBreadcrumbs[currStep - 1].name}
            <p className="min-w-48 text-wrap text-xs leading-tight font-normal text-gray-500">
                {accountSetupBreadcrumbs[currStep - 1].description}
            </p>
        </div>
    )
}

export function SetupBreadcrumbs() {
    const searchParams = useSearchParams();
    const currStep = searchParams.get("step");

    return (
        <aside className="w-5/12 max-md:hidden">
            <ol className="p-2">
                {accountSetupBreadcrumbs.map(step => {
                    return (
                        <li
                            key={`step-${step.step}`}
                            className="h-32"
                        >
                            <div className="flex flex-row gap-3">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={clsx(
                                        "flex justify-center items-center w-7 h-7 min-w-7 border-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-700 to-blue-600",
                                        { "opacity-10": (currStep && parseInt(currStep) < step.step) || (!currStep && step.step !== 1) },
                                    )}>
                                        <div className="w-5 h-5 border-0 rounded-full bg-white" />
                                    </div>
                                    <div className={clsx(
                                        "w-1 h-20 border-0 rounded-full bg-gradient-to-t from-purple-700 via-purple-500 to-blue-600",
                                        { "hidden": step.step === 3 },
                                        { "opacity-10": !currStep || parseInt(currStep) <= step.step },
                                    )} />
                                </div>
                                <div className={clsx(
                                    "lg:text-xl font-semibold",
                                    { "text-gray-500 opacity-40": currStep && parseInt(currStep) < step.step }
                                )}>
                                    {step.name}
                                    <p className="min-w-48 text-wrap text-sm leading-tight max-lg:text-xs font-normal text-gray-500">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </aside>
    )
}

export function MobileSetupBreadcrumbs() {
    const searchParams = useSearchParams();
    const currStep = searchParams.get("step");

    return (
        <div className="md:hidden mt-6">
            <ol className="flex flex-row justify-center gap-2">
                {accountSetupBreadcrumbs.map(step => {
                    return (
                        <li
                            key={`step-${step.step}`}
                            className="flex flex-row items-center gap-2"
                        >
                            <div className={clsx(
                                "flex justify-center items-center w-6 h-6 min-w-6 border-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-700 to-blue-600",
                                { "opacity-10": (currStep && parseInt(currStep) < step.step) || (!currStep && step.step !== 1) },
                            )}>
                                <div className="w-4 h-4 border-0 rounded-full bg-white" />
                            </div>
                            <div className={clsx(
                                "w-10 h-1 border-0 rounded-full bg-gradient-to-l from-purple-700 via-purple-500 to-blue-600",
                                { "hidden": step.step === 3 },
                                { "opacity-10": !currStep || parseInt(currStep) <= step.step },
                            )} />
                        </li>
                    )
                })}
            </ol>
            {getFormTitle(currStep)}
        </div>
    )
}