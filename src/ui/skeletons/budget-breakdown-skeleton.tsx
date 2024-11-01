function ChartSkeleton() {
    return (
        <div className="max-lg:col-span-full flex flex-col rounded-xl border border-slate-100 bg-white h-[420px] max-lg:h-96 px-6 pt-6 pb-4 shadow-lg">
            <div className="animate-pulse pb-3">
                <div className="h-6 w-5/12 rounded-md bg-gray-300" />
            </div>
            <div className="animate-pulse w-full h-full">
                <div className="w-full h-full rounded-md bg-gray-300" />
            </div>
        </div>
    )
}

export default function BudgetBreakdownSkeleton() {
    return (
        <>
            <ChartSkeleton />
            <ChartSkeleton />
        </>
    )
}