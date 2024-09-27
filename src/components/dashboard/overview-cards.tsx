import {
    DocumentChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/utils/format";
import clsx from "clsx";

const iconMap = {
    balance: DocumentChartBarIcon,
    income: CurrencyDollarIcon,
    expenditure: BanknotesIcon,
};

export default async function OverviewCards() {
    return (
        <>
            <Card title="Total balance" value={6969690} type="balance" />
            <Card title="Income" value={666000} type="income" />
            <Card title="Expenditure" value={420000} type="expenditure" />
        </>
    );
}

export function Card({
    title,
    value,
    type
}: {
    title: string,
    value: number,
    type: "balance" | "income" | "expenditure";
}) {
    const Icon = iconMap[type];

    return (
        <div className={clsx(
            "rounded-xl border border-slate-100 bg-white h-36 max-sm:h-32 min-w-56 max-sm:min-w-40 p-6 shadow-lg",
            { "max-lg:col-span-full max-md:h-32": type === "balance" },
        )}>
            <div className="flex items-center gap-2">
                <Icon className="w-6 h-6 text-blue-600" />
                <h2 className={clsx(
                    "text-lg max-sm:text-base font-medium",
                    { "max-md:text-base": type === "balance" },
                )}
                >
                    {title}
                </h2>
            </div>
            <div className={clsx(
                "my-2",
                { "max-md:flex max-md:justify-between max-md:items-center max-md:gap-4": type === "balance" },
                { "max-md:gap-1 max-sm:my-1": type !== "balance" }
            )}>
                <p className={clsx(
                    "text-3xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis",
                    { "max-sm:text-lg": type !== "balance" }
                )}>
                    {formatCurrency(value)}
                </p>
                <p className={clsx(
                    "text-sm text-gray-500",
                    { "max-sm:text-xs": type !== "balance" },
                )}>
                    <span className="text-green-500 font-semibold">+12345.6% </span>
                    since last month
                </p>
            </div>
        </div>
    )
}