import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

interface DepartmentBarChartProps {
  data: Array<{
    Department: string;
    Total_Students: number;
  }>;
  colors: string[];
}

/**
 * Enhanced bar chart with analytics overlay
 */
export const DepartmentBarChart = ({
  data,
  colors,
}: DepartmentBarChartProps) => {
  const avgStudents = useMemo(() => {
    if (!data) return 0;
    const total = data.reduce((sum, d) => sum + d.Total_Students, 0);
    return total / data.length;
  }, [data]);

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-foreground">
          Student Distribution by Department
        </h4>
        <div className="text-sm text-muted-foreground">
          Average:{" "}
          <span className="font-bold text-primary">
            {avgStudents.toFixed(0)}
          </span>{" "}
          students
        </div>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="Department"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: "hsl(var(--foreground))" }}
            label={{
              value: "Number of Students",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--foreground))" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
          <Bar
            dataKey="Total_Students"
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                opacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
