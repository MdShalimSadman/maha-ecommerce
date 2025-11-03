"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface OrderAnalysisChartProps {
  data: { name: string; value: number }[];
}

const OrderAnalysisChart = ({ data }: OrderAnalysisChartProps) => {
  const chartConfig = { value: { label: "Order Amount", color: "#A6686A" } };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Sales Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="value" fill="#A6686A" name="Total Order Amount ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrderAnalysisChart;
