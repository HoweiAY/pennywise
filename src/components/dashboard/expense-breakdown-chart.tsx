"use client";

import { Pie, PieChart } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { ExpenseBreakdownChartData } from "@/lib/types/chart";
import { useState, useEffect } from "react";

const defaultChartConfig = {
    amount: {
        label: "Amount",
    },
    "Food and Drinks": {
        label: "F&B",
        color: "#ec4899",
    },
    "Groceries": {
        label: "Groceries",
        color: "#f9a8d4",
    },
    "Health and Personal Care": {
        label: "Healthcare",
        color: "#fb7185",
    },
    "Housing": {
        label: "Housing",
        color: "#bfdbfe",
    },
    "Shopping": {
        label: "Shopping",
        color: "#38bdf8",
    },
    "Sports and Entertainment": {
        label: "Sports / Entertainment",
        color: "#2563eb",
    },
    "Travel and Transportation": {
        label: "Transportation",
        color: "#6d28d9",
    },
    "Utilities": {
        label: "Utilities",
        color: "#a855f7",
    },
    "Others": {
        label: "Others",
        color: "#c4b5fd",
    },
} satisfies ChartConfig;

export default function ExpenseBreakdownChart({
    chartData,
    currency,
}: {
    chartData: ExpenseBreakdownChartData,
    currency: string,
}) {
    const [ chartConfig, setChartConfig ] = useState<ChartConfig>(defaultChartConfig);

    useEffect(() => {
        setChartConfig(prevConfig => ({ ...prevConfig, amount: { label: `Amount (in ${currency})` } }));
    }, [currency]);

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <ChartContainer
                config={chartConfig}
                className="w-full h-[320px] max-h-[350px] max-lg:max-h-[280px] mx-auto"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent labelKey="amount" />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="category"
                    />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="category" />}
                        className="-translate-y-2 grid grid-flow-row grid-cols-2 max-lg:grid-cols-3 gap-0.5 [&>*]:text-nowrap [&>*]:text-ellipsis [&>*]:overflow-hidden"
                    />
                </PieChart>
            </ChartContainer>
            <p className="text-xs text-gray-500">* Based on data from the last 90 days</p>
        </div>
    )
}