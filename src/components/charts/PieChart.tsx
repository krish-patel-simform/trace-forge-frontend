import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieChartProps {
  data: Record<string, unknown>[];
  nameKey: string;
  dataKey: string;
  height?: number;
  donut?: boolean;
}

const COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#8b5cf6",
  "#d946ef",
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  nameKey,
  dataKey,
  height = 300,
  donut = true,
}) => {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={donut ? 60 : 0}
            outerRadius={80}
            paddingAngle={donut ? 2 : 0}
            dataKey={dataKey}
            nameKey={nameKey}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              color: 'var(--chart-tooltip-text)',
              borderColor: 'var(--chart-tooltip-border)',
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: 'var(--chart-tooltip-text)' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
