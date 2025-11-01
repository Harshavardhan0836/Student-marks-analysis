import { useMemo, useCallback, useState } from "react";
import { TrendingUp, Users, Building2, Award } from "lucide-react";
import { useOverviewData } from "@/hooks/useOverviewData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LoadingSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { DepartmentBarChart } from "@/components/charts/DepartmentBarChart";
import { AnalyticsPanel } from "@/components/charts/AnalyticsPanel";
import { getColorPalette } from "@/utils/formatters";
import { calculateDerivedMetrics } from "@/utils/analytics";

export default function Overview() {
  const { data, loading, error } = useOverviewData();
  const [refreshKey, setRefreshKey] = useState(0);

  const colors = useMemo(() => getColorPalette(), []);

  const derivedMetrics = useMemo(
    () => (data ? calculateDerivedMetrics(data) : null),
    [data]
  );

  const handleRetry = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    window.location.reload();
  }, []);

  // Loading state
  if (loading) return <LoadingSkeleton />;

  // Error state
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;

  // No data state
  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground mt-10">
        No data available
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold  bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          📊 Department Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Real-time insights and statistical analysis
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={data.total_students}
          icon={Users}
          color="text-indigo-600"
          subtitle="Across all departments"
        />

        <MetricCard
          title="Total Departments"
          value={data.total_departments}
          icon={Building2}
          color="text-green-600"
          subtitle="Active departments"
        />

        <MetricCard
          title="Average Marks"
          value={data.avg_marks}
          icon={Award}
          color="text-yellow-600"
          subtitle="Overall performance"
        />

        <MetricCard
          title="Avg per Dept"
          value={(data.total_students / data.total_departments).toFixed(0)}
          icon={TrendingUp}
          color="text-purple-600"
          subtitle="Students per department"
        />
      </div>

      {/* Analytics Panel */}
      {derivedMetrics && (
        <div className="mb-8">
          <AnalyticsPanel metrics={derivedMetrics} />
        </div>
      )}

      {/* Main Chart */}
      <DepartmentBarChart data={data.students_per_department} colors={colors} />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
