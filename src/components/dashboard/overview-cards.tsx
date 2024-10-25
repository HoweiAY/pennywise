import {
    DocumentChartBarIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { getUserBalanceData } from "@/lib/actions/user";
import { getTotalTransactionAmount } from "@/lib/actions/transaction";
import { formatCurrency, formatCurrencySymbol, formatAmountPercentageChange } from "@/lib/utils/format";
import { amountPercentageChange } from "@/lib/utils/helper";
import clsx from "clsx";

const cardIcons = {
    balance: DocumentChartBarIcon,
    income: CurrencyDollarIcon,
    expenditure: BanknotesIcon,
};

export default async function OverviewCards({ userId }: { userId: string }) {
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

    const currDateTime = new Date();
    const currMonthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 1, 0, 0, 0, 0);
    const prevMonthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - 1, 1, 0, 0, 0, 0);
    const prevMonthEndDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), 0, 23, 59, 59, 999); 

    const [
        { status: balanceStatus, message: balanceMessage, data: balanceData },
        { status: currMonthIncomeStatus, message: currMonthIncomeMessage, data: currMonthIncomeData },
        { status: prevMonthIncomeStatus, message: prevMonthIncomeMessage, data: prevMonthIncomeData },
        { status: currMonthExpenditureStatus, message: currMonthExpenditureMessage, data: currMonthExpenditureData },
        { status: prevMonthExpenditureStatus, message: prevMonthExpenditureMessage, data: prevMonthExpenditureData },
    ] = await Promise.all([
        getUserBalanceData(userId),
        getTotalTransactionAmount(userId, "Income", currMonthStartDateTime, currDateTime),
        getTotalTransactionAmount(userId, "Income", prevMonthStartDateTime, prevMonthEndDateTime),
        getTotalTransactionAmount(userId, "Expenditure", currMonthStartDateTime, currDateTime),
        getTotalTransactionAmount(userId, "Expenditure", prevMonthStartDateTime, prevMonthEndDateTime),
    ]);

    if (balanceStatus === "success" && balanceData) {
        const { balance, currency } = balanceData["userBalanceData"];
        overviewData.balanceInCents = balance;
        overviewData.currency = currency;
    } else {
        console.error(balanceMessage || "Failed to fetch user balance data");
    }

    let prevNetBalance = overviewData.balanceInCents;
    if (currMonthIncomeStatus === "success" && currMonthIncomeData) {
        overviewData.incomeInCents = currMonthIncomeData["transactionAmount"];
        if (prevNetBalance) {
            prevNetBalance -= overviewData.incomeInCents;
        }
        if (prevMonthIncomeStatus !== "success" || !prevMonthIncomeData) {
            console.error(prevMonthIncomeMessage || "Error fetching income amount last month");
        } else {
            const prevIncomeInCents = prevMonthIncomeData["transactionAmount"];
            overviewData.incomeChange = prevIncomeInCents
                ? prevIncomeInCents !== overviewData.incomeInCents
                    ? amountPercentageChange(prevIncomeInCents, overviewData.incomeInCents)
                    : 0
                : null;
        }
    } else {
        console.error(currMonthIncomeMessage || "Error fetching income amount this month");
    }
    if (currMonthExpenditureStatus === "success" && currMonthExpenditureData) {
        overviewData.expenditureInCents = currMonthExpenditureData["transactionAmount"];
        if (prevNetBalance) {
            prevNetBalance += overviewData.expenditureInCents;
        }
        if (prevMonthExpenditureStatus !== "success" || !prevMonthExpenditureData) {
            console.error(prevMonthExpenditureMessage || "Error fetching expenditure amount last month");
        } else {
            const prevExpenditureInCents = prevMonthExpenditureData["transactionAmount"];
            overviewData.expenditureChange = prevExpenditureInCents 
                ? prevExpenditureInCents !== overviewData.expenditureInCents
                    ? amountPercentageChange(prevExpenditureInCents, overviewData.expenditureInCents)
                    : 0
                : null;
        }
    } else {
        console.error(currMonthExpenditureMessage || "Error fetching expenditure amount this month");
    }
    if (prevNetBalance && overviewData.balanceInCents) {
        overviewData.balanceChange = overviewData.incomeChange && overviewData.expenditureChange
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
                error={balanceStatus !== "success"}
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
                    {amountInCents 
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
                            {amountChange !== null ? `${formatAmountPercentageChange(amountChange)} ` : "--% "}
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