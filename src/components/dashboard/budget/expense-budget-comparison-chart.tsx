"use client";

import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ExpenseBudgetComparisonChartData } from "@/lib/types/chart";
import { useState, useEffect } from "react";

const defaultChartConfig = {
    amount: {
        label: "Amount"
    },
    expenseAmount: {
        label: "Total expense",
        color: "#2563eb",
    },
    spentBudgetAmount: {
        label: "Budget spent",
        color: "#ec4899",
    },
} satisfies ChartConfig;

export default function ExpenseBudgetComparisonChart({
    chartData,
    currency,
}: {
    chartData: ExpenseBudgetComparisonChartData,
    currency: string,
}) {
    const [ chartConfig, setChartConfig ] = useState<ChartConfig>(defaultChartConfig);

    useEffect(() => {
        setChartConfig(prevConfig => ({ ...prevConfig, amount: { label: `Amount (in ${currency})` } }));
    }, [currency]);

    return (
        <div className="flex flex-col justify-between items-center gap-y-1 w-full h-full">
            <h3 className="self-start text-sm text-gray-500 -mt-2">
                Comparison between total expense and budget spent
            </h3>
            <ChartContainer config={chartConfig} className="w-full h-[280px] max-lg:h-[280px] min-h-64">
                <BarChart
                    accessibilityLayer
                    data={chartData}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent labelKey="amount" />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                        dataKey="expenseAmount"
                        fill="#2563eb"
                        radius={4}
                    />
                    <Bar
                        dataKey="spentBudgetAmount"
                        fill="#ec4899"
                        radius={4}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}