"use client";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";
import { BudgetAllocationChartData } from "@/lib/types/chart";
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

export default function BudgetAllocationChart({
    chartData,
    currency,
}: {
    chartData: BudgetAllocationChartData,
    currency: string,
}) {
    const [ chartConfig, setChartConfig ] = useState<ChartConfig>(defaultChartConfig);

    useEffect(() => {
        setChartConfig(prevConfig => ({ ...prevConfig, amount: { label: `Amount (in ${currency})` } }));
    }, [currency]);

    return (
        <div className="flex flex-col justify-between items-center w-full h-full ">
            <h3 className="self-start text-sm text-gray-500 -mt-2">
                Allocated budget amount by category
            </h3>
            <div className="flex justify-center items-center w-full h-full">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-h-[320px] max-lg:max-h-[270px]">
                <RadialBarChart data={chartData} innerRadius={"40%"} outerRadius={"100%"}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent labelKey="amount" nameKey="category" />}
                    />
                    <PolarGrid gridType="circle" />
                    <RadialBar dataKey="amount" />
                </RadialBarChart>
            </ChartContainer>
            </div>
        </div>
    )
}