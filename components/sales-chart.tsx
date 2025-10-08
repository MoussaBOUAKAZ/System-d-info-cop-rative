"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"

const data = [
  { month: "Jan", revenue: 45000, deals: 12 },
  { month: "Fév", revenue: 52000, deals: 15 },
  { month: "Mar", revenue: 48000, deals: 13 },
  { month: "Avr", revenue: 61000, deals: 18 },
  { month: "Mai", revenue: 55000, deals: 16 },
  { month: "Juin", revenue: 67000, deals: 20 },
  { month: "Juil", revenue: 72000, deals: 22 },
]

const chartConfig = {
  revenue: {
    label: "Revenu",
    color: "hsl(var(--chart-1))",
  },
  deals: {
    label: "Deals",
    color: "hsl(var(--chart-2))",
  },
}

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des ventes</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
            <YAxis className="text-xs" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
