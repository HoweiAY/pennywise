import TransactionChart from "@/components/dashboard/transaction-chart";
import ExpenseBreakdownChart from "@/components/dashboard/expense-breakdown-chart";
import { DataResponse } from "@/lib/types/data";
import { TransactionCategoryId } from "@/lib/types/transactions";
import { TransactionChartData, ExpenseBreakdownChartData } from "@/lib/types/chart";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import { getTotalTransactionAmount, getTotalExpenseByCategoryId } from "@/lib/data/transaction";
import { formatCurrencyAmount } from "@/lib/utils/format";
import { transactionCategories } from "@/lib/utils/constant";
import clsx from "clsx";

async function getTransactionChartData(userId: string) {
    const transactionData: TransactionChartData = [];
    const fetchDepositData: Promise<DataResponse<number | null>>[] = [];
    const fetchExpenseData: Promise<DataResponse<number | null>>[] = [];
    const currDateTime = new Date();
    let monthStartDateTime: Date, monthEndDateTime: Date;

    for (let monthOffest = 5; monthOffest >= 0; monthOffest--) {
        monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - monthOffest, 1, 0, 0, 0, 0);
        monthEndDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - monthOffest + 1, 0, 23, 59, 59, 999);
        fetchDepositData.push(getTotalTransactionAmount(userId, "income", monthStartDateTime, monthEndDateTime));
        fetchExpenseData.push(getTotalTransactionAmount(userId, "expenditure", monthStartDateTime, monthEndDateTime));
    }
    const depositRes = await Promise.all(fetchDepositData);
    const expenseRes = await Promise.all(fetchExpenseData);
    const dataRes = depositRes.map((depositData, idx) => [depositData, expenseRes[idx]]);

    let monthOffest = 5;
    dataRes.forEach(data => {
        const [ depositData, expenseData ] = data;
        const monthName = new Date(
            currDateTime.getFullYear(),
            currDateTime.getMonth() - monthOffest
        ).toLocaleString("default", { month: "short" });
        const monthlyData = {
            month: monthName,
            deposit: 0,
            expense: 0,
        };
        if (depositData.status !== "success" || !depositData.data) {
            console.error(depositData.message || `Failed to fetch deposit amount for ${monthName}`);
        } else {
            monthlyData.deposit = Number(formatCurrencyAmount(depositData.data["transactionAmount"] ?? 0));
        }
        if (expenseData.status !== "success" || !expenseData.data) {
            console.error(expenseData.message || `Failed to fetch expense amount for ${monthName}`);
        } else {
            monthlyData.expense = Number(formatCurrencyAmount(expenseData.data["transactionAmount"] ?? 0));
        }
        transactionData.push(monthlyData);
        monthOffest--;
    });

    return transactionData satisfies TransactionChartData;
}

async function getExpenseBreakdownChartData(userId: string) {
    const expenseData: ExpenseBreakdownChartData = [];
    const fetchExpenseAmountData: Promise<DataResponse<number | null>>[] = [];
    const currDateTime = new Date();
    const ninetyDaysPriorDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth(), currDateTime.getDate() - 90, 0, 0, 0, 0);

    let categoryId: TransactionCategoryId;
    for (categoryId = 1; categoryId <= 9; categoryId++) {
        fetchExpenseAmountData.push(
            getTotalExpenseByCategoryId(
                userId,
                categoryId as TransactionCategoryId,
                ninetyDaysPriorDateTime,
                currDateTime,
            )
        );
    }
    const res = await Promise.all(fetchExpenseAmountData);

    categoryId = 1;
    let noData = true;
    res.forEach(expenseAmountData => {
        const categoryName = transactionCategories[categoryId].name;
        const categoryExpenseData = {
            category: categoryName,
            amount: 0,
            fill: transactionCategories[categoryId].color,
        };
        if (expenseAmountData.status !== "success" || !expenseAmountData.data) {
            console.error(expenseAmountData.message || `Failed to fetch user expense amount for category '${categoryName}'`);
        } else {
            categoryExpenseData.amount = Number(formatCurrencyAmount(expenseAmountData.data["expenseAmount"] ?? 0));
            if (categoryExpenseData.amount > 0) {
                noData = false;
            }
        }
        expenseData.push(categoryExpenseData);
        categoryId++;
    });

    return !noData ? expenseData satisfies ExpenseBreakdownChartData : null;
}

export default async function DashboardChartContainer({
    title,
    type,
    userId,
    currency,
    colSpan,
}: {
    title: string,
    type: "transaction-chart" | "expense-breakdown-chart",
    userId: string,
    currency: string,
    colSpan?: 1 | 2 | 3,
}) {
    const ChartIcon = type === "transaction-chart" ? ArrowTrendingUpIcon : ChartPieIcon;
    const chartData = await (type === "transaction-chart" ? getTransactionChartData(userId) : getExpenseBreakdownChartData(userId));

    return (
        <div className={clsx(
            "max-lg:col-span-full flex flex-col rounded-xl border border-slate-100 bg-white h-[420px] max-lg:h-96 px-6 pt-6 pb-4 shadow-lg",
            {
                "col-span-1": !colSpan || colSpan === 1,
                "col-span-2": colSpan === 2,
                "col-span-3": colSpan === 3,
            },
        )}>
            <div className="flex items-center gap-2 pb-3">
                <ChartIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg max-sm:text-base font-medium text-nowrap text-ellipsis overflow-hidden">
                    {title}
                </h2>
            </div>
            {type === "transaction-chart"
                ? <TransactionChart chartData={chartData as TransactionChartData} currency={currency} />
                : <ExpenseBreakdownChart chartData={chartData as ExpenseBreakdownChartData | null} currency={currency} />
            }
        </div>
    )
}