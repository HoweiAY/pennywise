import clsx from "clsx";

export function CardSkeleton({ type }: { type: "balance" | "income" | "expenditure" }) {
    return (
        <div className={clsx(
            "rounded-xl border border-slate-100 bg-white h-36 max-sm:h-32 min-w-56 max-sm:min-w-40 p-6 shadow-lg",
            { "max-lg:col-span-full max-md:h-32": type === "balance" },
        )}>
            <div className="flex flex-col gap-2">
                <div className="animate-pulse h-6 w-9/12 rounded-md bg-gray-300"></div>
                <div className="animate-pulse h-6 w-1/2 rounded-md bg-gray-300"></div>
                <div className={clsx(
                    "block",
                    { "max-md:hidden": type === "balance" }
                )}>
                    <div className="animate-pulse h-6 w-9/12 rounded-md bg-gray-300"></div>
                </div>
            </div>
        </div>
    )
}

export default function OverviewCardsSkeleton() {
    return (
        <>
            <CardSkeleton type="balance" />
            <CardSkeleton type="income" />
            <CardSkeleton type="expenditure" />
        </>
    )
}