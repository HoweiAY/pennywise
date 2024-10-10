import {
    DocumentChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/lib/utils/format";
import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import clsx from "clsx";

const iconMap = {
    balance: DocumentChartBarIcon,
    income: CurrencyDollarIcon,
    expenditure: BanknotesIcon,
};

export default async function OverviewCards({
    supabaseClient,
    userId,
}: {
    supabaseClient: SupabaseClient,
    userId: string,
}) {
    noStore();
    
    const overviewData: {
        balance: number | null,
        income: number | null,
        expenditure: number | null,
        balanceChange: number | null,
        incomeChange: number | null,
        expenditureChange: number | null,
        currency: string | null,
    } = {
        balance: null,
        income: null,
        expenditure: null,
        balanceChange: null,
        incomeChange: null,
        expenditureChange: null,
        currency: null,
    };

    const { data: balanceData, error: balanceError } = await supabaseClient
        .from("users")
        .select("balance, currency")
        .eq("user_id", userId)
        .limit(1);
    if (!balanceError && balanceData.length > 0) {
        overviewData.balance = balanceData[0].balance;
        overviewData.currency = balanceData[0].currency;
    }

    return (
        <>
            <Card
                title="Total balance"
                value={overviewData.balance}
                valueChange={overviewData.balanceChange}
                currency={overviewData.currency}
                type="balance"
            />
            <Card
                title="Income"
                value={overviewData.income}
                valueChange={overviewData.incomeChange}
                currency={overviewData.currency}
                type="income"
            />
            <Card
                title="Expenditure"
                value={overviewData.expenditure}
                valueChange={overviewData.expenditureChange}
                currency={overviewData.currency}
                type="expenditure"
            />
        </>
    );
}

export function Card({
    title,
    value,
    valueChange,
    currency,
    type
}: {
    title: string,
    value: number | null,
    valueChange: number | null,
    currency: string | null,
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
                    "text-3xl max-sm:text-2xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis",
                    { "max-sm:text-lg": type !== "balance" }
                )}>
                    {value ? formatCurrency(value, currency) : "$ --"}
                </p>
                {
                    value 
                    ?
                    <p className="text-sm max-sm:text-xs text-gray-500">
                        <span className="text-green-500 font-semibold">+12345.6% </span>
                        since last month
                    </p>
                    : 
                    <div className="flex flex-row items-center gap-1 my-1 text-red-500">
                        <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4 min-w-4 min-h-4" />
                        <span className="text-sm max-md:text-xs text-nowrap text-ellipsis overflow-hidden">Error loading {type} data</span>
                    </div>
                }
            </div>
        </div>
    )
}