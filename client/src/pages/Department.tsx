import { useState, useMemo, useCallback } from "react";
import { Users, Award, TrendingUp, BookOpen, AlertCircle } from "lucide-react";
import { useDepartmentList } from "@/hooks/useDepartmentList";
import { useDepartmentData } from "@/hooks/useDepartmentData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DataTable } from "@/components/dashboard/DataTable";
import { PerformersPanel } from "@/components/dashboard/PerformersPanel";
import { SubjectPerformanceChart } from "@/components/charts/SubjectPerformanceChart";
import { PassFailAnalysis } from "@/components/charts/PassFailAnalysis";
import {
  calculatePerformanceMetrics,
  calculateSubjectAverages,
  analyzePassFailRates,
  getPerformers,
} from "@/utils/analytics";
import { exportToCSV } from "@/utils/export";

export default function Department() {
  const { departments, loading: deptLoading } = useDepartmentList();
  const { data, loading, error, fetchData, resetData } = useDepartmentData();

  const [filters, setFilters] = useState({
    department: "",
    semester: "",
  });

  // Derived analytics
  const analytics = useMemo(() => {
    if (!data?.data) return null;

    return {
      performance: calculatePerformanceMetrics(data.data),
      subjectAverages: calculateSubjectAverages(data.data),
      passFailRates: analyzePassFailRates(data.data),
      performers: getPerformers(data.data),
    };
  }, [data]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = useCallback(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const handleReset = useCallback(() => {
    setFilters({ department: "", semester: "" });
    resetData();
  }, [resetData]);

  const handleExport = useCallback(
    (exportData: any[]) => {
      const filename = `${filters.department || "all"}_sem${
        filters.semester || "all"
      }_${Date.now()}.csv`;
      exportToCSV(exportData, filename);
    },
    [filters]
  );

  return (
    <div className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold  bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          📚 Department Analytics
        </h2>
        <p className="text-muted-foreground">
          Comprehensive student performance analysis and insights
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        departments={departments}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApply}
        onReset={handleReset}
        loading={loading || deptLoading}
      />

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {!data ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={Users}
              title="Total Students"
              value={data.total_students}
              subtitle={`${filters.department || "All departments"} - Sem ${
                filters.semester || "All"
              }`}
              color="text-indigo-600"
            />
            <MetricCard
              icon={Award}
              title="Average Marks"
              value={data.avg_marks}
              subtitle="Overall performance"
              color="text-green-600"
            />
            {analytics?.performance && (
              <>
                <MetricCard
                  icon={TrendingUp}
                  title="Highest Score"
                  value={analytics.performance.total.max}
                  subtitle="Top performer"
                  color="text-purple-600"
                />
                <MetricCard
                  icon={BookOpen}
                  title="Median Score"
                  value={analytics.performance.total.median}
                  subtitle="Middle performance"
                  color="text-yellow-600"
                />
              </>
            )}
          </div>

          {/* Charts */}
          {analytics?.subjectAverages &&
            analytics.subjectAverages.length > 0 && (
              <SubjectPerformanceChart data={analytics.subjectAverages} />
            )}

          {/* Pass/Fail Analysis */}
          {analytics?.passFailRates && (
            <PassFailAnalysis passFailData={analytics.passFailRates} />
          )}

          {/* Performers */}
          {analytics?.performers && (
            <PerformersPanel performers={analytics.performers} />
          )}

          {/* Data Table */}
          {data.data && data.data.length > 0 && (
            <DataTable data={data.data} onExport={handleExport} />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
