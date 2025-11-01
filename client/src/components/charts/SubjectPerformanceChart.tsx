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

interface SubjectPerformanceChartProps {
  data: Array<{
    subject: string;
    average: number;
  }>;
}

const colors = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

/**
 * Subject performance bar chart
 */
export const SubjectPerformanceChart = ({
  data,
}: SubjectPerformanceChartProps) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
      <h4 className="text-xl font-semibold text-foreground mb-6">
        Subject-wise Average Performance
      </h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="subject"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--foreground))" }}
            label={{
              value: "Average Marks",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--foreground))" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Legend />
          <Bar dataKey="average" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
