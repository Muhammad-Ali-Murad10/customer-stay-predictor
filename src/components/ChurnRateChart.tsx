
import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { filterDataByDateRange } from '@/data/chartData';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ChurnRateChartProps {
  data: Array<{ month: string; rate: number }>;
  startMonth: number;
  endMonth: number;
}

const ChurnRateChart: React.FC<ChurnRateChartProps> = ({ data, startMonth, endMonth }) => {
  const filteredData = filterDataByDateRange(data, startMonth, endMonth);
  
  const chartConfig = {
    rate: {
      label: "Churn Rate",
      color: "hsl(var(--destructive))"
    }
  };
  
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 10]}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="rate" 
            name="Churn Rate" 
            fill="hsl(var(--destructive))" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ChurnRateChart;
