import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface PassFailAnalysisProps {
  passFailData: {
    [key: string]: {
      passed: number;
      failed: number;
      rate: number;
    };
  };
}

/**
 * Pass/Fail analysis panel
 */
export const PassFailAnalysis = ({ passFailData }: PassFailAnalysisProps) => {
  if (!passFailData) return null;

  const chartData = Object.entries(passFailData).map(([subject, stats]) => ({
    subject: subject.substring(0, 20),
    passed: stats.passed,
    failed: stats.failed,
    rate: parseFloat(stats.rate as any),
  }));

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
      <h4 className="text-xl font-semibold text-foreground mb-6">
        Pass/Fail Analysis by Subject
      </h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
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
          <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="passed"
            fill="#10B981"
            name="Passed"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="failed"
            fill="#EF4444"
            name="Failed"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
