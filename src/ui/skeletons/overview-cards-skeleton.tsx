import clsx from "clsx";

function CardSkeleton({ type }: { type: "balance" | "income" | "expenditure" }) {
    return (
        <div className={clsx(
            "rounded-xl border border-slate-100 bg-white h-36 max-sm:h-32 min-w-56 max-sm:min-w-40 p-6 shadow-lg",
            { "max-lg:col-span-full max-md:h-32": type === "balance" },
        )}>
            <div className="animate-pulse flex flex-col gap-2">
                <div className="h-6 w-5/12 rounded-md bg-gray-300"></div>
                <div className={clsx(
                    "h-6 w-8/12 max-md:w-full rounded-md bg-gray-300",
                    {"max-md:h-10 max-md:w-full": type === "balance"},
                )}></div>
                <div className={clsx(
                    "block",
                    { "max-md:hidden": type === "balance" }
                )}>
                    <div className="h-6 w-1/2 max-md:w-full border rounded-md bg-gray-300"></div>
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