import {
    DocumentChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { getTotalTransactionAmount } from "@/lib/data/transaction";
import { UserBalanceData } from "@/lib/types/user";
import { formatCurrency, formatCurrencySymbol, formatAmountPercentageChange } from "@/lib/utils/format";
import { amountPercentageChange } from "@/lib/utils/helper";
import clsx from "clsx";

const cardIcons = {
    balance: DocumentChartBarIcon,
    income: CurrencyDollarIcon,
    expenditure: BanknotesIcon,
};

export default async function OverviewCards({
    userId,
    userBalanceData,
}: {
    userId: string,
    userBalanceData: UserBalanceData | null,
}) {
    const overviewData: {
        balanceInCents: number | null,
        incomeInCents: number | null,
        expenditureInCents: number | null,
        balanceChange: number | null,
        incomeChange: number | null,
        expenditureChange: number | null,
        currency: string | null,
    } = {
        balanceInCents: null,
        incomeInCents: null,
        expenditureInCents: null,
        balanceChange: null,
        incomeChange: null,
        expenditureChange: null,
        currency: null,
    };

    const balanceData = userBalanceData;
    if (balanceData) {
        overviewData.balanceInCents = balanceData.balance;
        overviewData.currency = balanceData.currency;
    }

    const currDateTime = new Date();
    const currMonthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
    const prevMonthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - 1, 1, 0, 0, 0, 0);
    const prevMonthEndDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 0, 23, 59, 59, 999); 

    const [
        { status: currMonthIncomeStatus, message: currMonthIncomeMessage, data: currMonthIncomeData },
        { status: prevMonthIncomeStatus, message: prevMonthIncomeMessage, data: prevMonthIncomeData },
        { status: currMonthExpenditureStatus, message: currMonthExpenditureMessage, data: currMonthExpenditureData },
        { status: prevMonthExpenditureStatus, message: prevMonthExpenditureMessage, data: prevMonthExpenditureData },
    ] = await Promise.all([
        getTotalTransactionAmount(userId, "income", currMonthStartDateTime, currDateTime),
        getTotalTransactionAmount(userId, "income", prevMonthStartDateTime, prevMonthEndDateTime),
        getTotalTransactionAmount(userId, "expenditure", currMonthStartDateTime, currDateTime),
        getTotalTransactionAmount(userId, "expenditure", prevMonthStartDateTime, prevMonthEndDateTime),
    ]);

    let prevNetBalance = overviewData.balanceInCents;
    if (currMonthIncomeStatus !== "success" || !currMonthIncomeData) {
        console.error(currMonthIncomeMessage || "Error fetching income amount this month");
    } else {
        overviewData.incomeInCents = currMonthIncomeData["transactionAmount"] ?? 0;
        if (prevNetBalance) {
            prevNetBalance -= overviewData.incomeInCents;
        }
        if (prevMonthIncomeStatus !== "success" || !prevMonthIncomeData) {
            console.error(prevMonthIncomeMessage || "Error fetching income amount last month");
        } else {
            const prevIncomeInCents = prevMonthIncomeData["transactionAmount"];
            overviewData.incomeChange = prevIncomeInCents
                ? amountPercentageChange(prevIncomeInCents, overviewData.incomeInCents)
                : null;
        }
    }
    if (currMonthExpenditureStatus !== "success" || !currMonthExpenditureData) {
        console.error(currMonthExpenditureMessage || "Error fetching expenditure amount this month");
    } else {
        overviewData.expenditureInCents = currMonthExpenditureData["transactionAmount"] ?? 0;
        if (prevNetBalance) {
            prevNetBalance += overviewData.expenditureInCents;
        }
        if (prevMonthExpenditureStatus !== "success" || !prevMonthExpenditureData) {
            console.error(prevMonthExpenditureMessage || "Error fetching expenditure amount last month");
        } else {
            const prevExpenditureInCents = prevMonthExpenditureData["transactionAmount"];
            overviewData.expenditureChange = prevExpenditureInCents 
                ? amountPercentageChange(prevExpenditureInCents, overviewData.expenditureInCents)
                : null;
        }
    }
    if (prevNetBalance && overviewData.balanceInCents) {
        overviewData.balanceChange = overviewData.incomeChange || overviewData.expenditureChange
            ? amountPercentageChange(prevNetBalance, overviewData.balanceInCents)
            : null;
    }

    return (
        <>
            <Card
                title="Total balance"
                amountInCents={overviewData.balanceInCents}
                amountChange={overviewData.balanceChange}
                currency={overviewData.currency}
                type="balance"
                error={!balanceData}
            />
            <Card
                title="Income"
                amountInCents={overviewData.incomeInCents}
                amountChange={overviewData.incomeChange}
                currency={overviewData.currency}
                type="income"
                error={currMonthIncomeStatus !== "success" && prevMonthIncomeStatus !== "success"}
            />
            <Card
                title="Expenditure"
                amountInCents={overviewData.expenditureInCents}
                amountChange={overviewData.expenditureChange}
                currency={overviewData.currency}
                type="expenditure"
                error={currMonthExpenditureStatus !== "success" && prevMonthExpenditureStatus !== "success"}
            />
        </>
    );
}

export function Card({
    title,
    amountInCents,
    amountChange,
    currency,
    type,
    error,
}: {
    title: string,
    amountInCents: number | null,
    amountChange: number | null,
    currency: string | null,
    type: "balance" | "income" | "expenditure",
    error: boolean,
}) {
    const CardIcon = cardIcons[type];

    return (
        <div className={clsx(
            "rounded-xl border border-slate-100 bg-white h-36 max-sm:h-32 min-w-56 max-sm:min-w-40 p-6 shadow-lg",
            { "max-lg:col-span-full max-md:h-32": type === "balance" },
        )}>
            <div className="flex items-center gap-2">
                <CardIcon className="w-6 h-6 text-blue-600" />
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
                    {amountInCents !== null
                        ? formatCurrency(amountInCents, currency)
                        : currency 
                        ? `${formatCurrencySymbol(currency)} --`
                        : "$ --"
                    }
                </p>
                {!error
                    ?
                    <p className="text-sm max-sm:text-xs text-gray-500 md:text-nowrap md:text-ellipsis md:overflow-hidden">
                        <span className={clsx(
                            "font-semibold",
                            {
                                "font-normal": amountChange === null,
                                "text-green-500": (type === "expenditure" && amountChange && amountChange <= 0) || (type !== "expenditure" && amountChange && amountChange >= 0),
                                "text-red-500": (type === "expenditure" && amountChange && amountChange > 0) || (type !== "expenditure" && amountChange && amountChange < 0),
                            },
                        )}>
                            {amountChange !== null ? `${amountChange > 0 ? "+" : ""}${formatAmountPercentageChange(amountChange)} ` : "--% "}
                        </span>
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