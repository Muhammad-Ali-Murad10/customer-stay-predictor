
import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import { filterDataByDateRange } from '@/data/chartData';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface SatisfactionChartProps {
  data: Array<{ month: string; score: number }>;
  startMonth: number;
  endMonth: number;
}

const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ data, startMonth, endMonth }) => {
  const filteredData = filterDataByDateRange(data, startMonth, endMonth);
  
  const chartConfig = {
    score: {
      label: "Satisfaction Score",
      color: "hsl(var(--secondary))"
    }
  };
  
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis 
            domain={[0, 10]} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="score" 
            name="Satisfaction Score" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default SatisfactionChart;
