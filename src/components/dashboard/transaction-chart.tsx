"use client";

import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { TransactionChartData } from "@/lib/types/chart";
import { useState, useEffect } from "react";

const defaultChartConfig = {
    amount: {
        label: "Amount"
    },
    deposit: {
        label: "Deposit",
        color: "#2563eb",
    },
    expense: {
        label: "Expense",
        color: "#ec4899",
    },
} satisfies ChartConfig;

export default function TransactionChart({
    chartData,
    currency,
}: {
    chartData: TransactionChartData,
    currency: string,
}) {
    const [ chartConfig, setChartConfig ] = useState<ChartConfig>(defaultChartConfig);

    useEffect(() => {
        setChartConfig(prevConfig => ({ ...prevConfig, amount: { label: `Amount (in ${currency})` } }));
    }, [currency]);

    return (
        <ChartContainer config={chartConfig} className="w-full h-[350px] max-lg:h-full min-h-72">
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 12, right: 12 }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="amount" />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                    dataKey="deposit"
                    type="monotone"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="expense"
                    type="monotone"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    )
}