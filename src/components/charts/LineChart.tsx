import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface LineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: { key: string; name: string; color: string }[];
  height?: number;
  variant?: 'line' | 'area';
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  series,
  height = 300,
  variant = 'line',
}) => {
  const ChartComponent = variant === 'area' ? AreaChart : RechartsLineChart;

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--chart-tooltip-bg)',
              color: 'var(--chart-tooltip-text)',
              borderColor: 'var(--chart-tooltip-border)',
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ color: 'var(--chart-tooltip-text)' }}
          />
          
          {series.map((s) => (
            variant === 'area' ? (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.2}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};
