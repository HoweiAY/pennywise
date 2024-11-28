import clsx from "clsx";

function ChartSkeleton({ colSpan }: { colSpan?: 1 | 2 | 3 }) {
    return (
        <div className={clsx(
            "max-lg:col-span-full flex flex-col rounded-xl border border-slate-100 bg-white h-[420px] max-lg:h-96 px-6 pt-6 pb-4 shadow-lg",
            {
                "col-span-1": !colSpan || colSpan === 1,
                "col-span-2": colSpan === 2,
                "col-span-3": colSpan === 3,
            },
        )}>
            <div className="animate-pulse pb-3">
                <div className="h-6 w-5/12 rounded-md bg-gray-300" />
            </div>
            <div className="animate-pulse w-full h-full">
                <div className="w-full h-full rounded-md bg-gray-300" />
            </div>
        </div>
    )
}

export default function DashboardChartSkeleton() {
    return (
        <>
            <ChartSkeleton colSpan={2} />
            <ChartSkeleton />
        </>
    )
}