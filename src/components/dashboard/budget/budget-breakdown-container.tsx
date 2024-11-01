import ExpenseBudgetComparisonChart from "@/components/dashboard/budget/expense-budget-comparison-chart";
import BudgetAllocationChart from "@/components/dashboard/budget/budget-allocation-chart";
import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import { getUserTotalBudgetAmountByCategory, getTotalBudgetAmountSpent } from "@/lib/data/budget";
import { getTotalTransactionAmount } from "@/lib/data/transaction";
import { DataResponse } from "@/lib/types/data";
import { BudgetCategoryId } from "@/lib/types/budget";
import { ExpenseBudgetComparisonChartData, BudgetAllocationChartData } from "@/lib/types/chart";
import { budgetCategories } from "@/lib/utils/constant";
import { formatCurrencyAmount } from "@/lib/utils/format";
import clsx from "clsx";

async function getExpenseBudgetComparisonChartData(userId: string) {
    const expenseBudgetData: ExpenseBudgetComparisonChartData = [];
    const fetchExpenseAmountData: Promise<DataResponse<number | null>>[] = [];
    const fetchSpentBudgetAmountData: Promise<DataResponse<number | null>>[] = [];
    const currDateTime = new Date();
    let monthStartDateTime: Date, monthEndDateTime: Date;

    for (let monthOffest = 5; monthOffest >= 0; monthOffest--) {
        monthStartDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - monthOffest, 1, 0, 0, 0, 0);
        monthEndDateTime = new Date(currDateTime.getFullYear(), currDateTime.getMonth() - monthOffest + 1, 0, 23, 59, 59, 999);
        fetchExpenseAmountData.push(getTotalTransactionAmount(userId, "expenditure", monthStartDateTime, monthEndDateTime));
        fetchSpentBudgetAmountData.push(getTotalBudgetAmountSpent(userId, monthStartDateTime, monthEndDateTime));
    }
    const expenseRes = await Promise.all(fetchExpenseAmountData);
    const budgetRes = await Promise.all(fetchSpentBudgetAmountData);
    const dataRes = expenseRes.map((expenseData, idx) => [expenseData, budgetRes[idx]]);

    let monthOffest = 5;
    dataRes.forEach(data => {
        const [ expenseData, budgetData ] = data;
        const monthName = new Date(
            currDateTime.getFullYear(),
            currDateTime.getMonth() - monthOffest
        ).toLocaleString("default", { month: "short" });
        const monthlyData = {
            month: monthName,
            expenseAmount: 0,
            spentBudgetAmount: 0,
        };
        if (expenseData.status !== "success" || !expenseData.data) {
            console.error(expenseData.message || `Failed to fetch expense amount for ${monthName}`);
        } else {
            monthlyData.expenseAmount = Number(formatCurrencyAmount(expenseData.data["transactionAmount"] ?? 0));
        }
        if (budgetData.status !== "success" || !budgetData.data) {
            console.error(budgetData.message || `Failed to fetch spent budget amount for ${monthName}`);
        } else {
            monthlyData.spentBudgetAmount = Number(formatCurrencyAmount(budgetData.data["spentBudget"] ?? 0));
        }
        expenseBudgetData.push(monthlyData);
        monthOffest--;
    });

    return expenseBudgetData satisfies ExpenseBudgetComparisonChartData;
}

async function getBudgetAllocationChartData(userId: string) {
    const budgetAllocationData: BudgetAllocationChartData = [];
    const fetchBudgetAllocationData: Promise<DataResponse<number>>[] = [];

    let categoryId: BudgetCategoryId;
    for (categoryId = 1; categoryId <= 9; categoryId++) {
        fetchBudgetAllocationData.push(
            getUserTotalBudgetAmountByCategory(
                userId,
                categoryId as BudgetCategoryId,
            )
        );
    }
    const res = await Promise.all(fetchBudgetAllocationData);

    categoryId = 1;
    res.forEach(budgetData => {
        const categoryName = budgetCategories[categoryId].name;
        const categoryData = {
            category: categoryName,
            amount: 0,
            fill: budgetCategories[categoryId].color,
        };
        if (budgetData.status !== "success" || !budgetData.data) {
            console.error(budgetData.message || `Failed to fetch allocated budget amount for category '${categoryName}'`);
        } else {
            categoryData.amount = Number(formatCurrencyAmount(budgetData.data["budgetAmount"]));
        }
        budgetAllocationData.push(categoryData);
        categoryId++;
    });

    return budgetAllocationData satisfies BudgetAllocationChartData;
}

export default async function BudgetBreakdownContainer({
    title,
    type,
    userId,
    currency,
}: {
    title: string,
    type: "expense-budget-comparison-chart" | "budget-allocation-chart",
    userId: string,
    currency: string,
}) {
    const ChartIcon = type === "expense-budget-comparison-chart" ? DocumentChartBarIcon : ChartPieIcon;
    const chartData = await (type === "expense-budget-comparison-chart"
        ? getExpenseBudgetComparisonChartData(userId)
        : getBudgetAllocationChartData(userId)
    );

    return (
        <div className={clsx(
            "col-span-1 max-lg:col-span-full flex flex-col rounded-xl border border-slate-100 bg-white h-[420px] max-lg:h-96 px-6 pt-6 pb-4 shadow-lg",
        )}>
            <div className="flex items-center gap-2 pb-3">
                <ChartIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg max-sm:text-base font-medium text-nowrap text-ellipsis overflow-hidden">
                    {title}
                </h2>
            </div>
            {type === "expense-budget-comparison-chart"
                ? <ExpenseBudgetComparisonChart chartData={chartData as ExpenseBudgetComparisonChartData} currency={currency} />
                : <BudgetAllocationChart chartData={chartData as BudgetAllocationChartData} currency={currency} />
            }
        </div>
    )
}