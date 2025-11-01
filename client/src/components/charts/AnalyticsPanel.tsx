import { Award } from "lucide-react";

interface AnalyticsPanelProps {
  metrics: {
    largestDept: {
      Department: string;
      Total_Students: number;
    };
    smallestDept: {
      Department: string;
      Total_Students: number;
    };
    median: number;
    standardDeviation: number;
    distributionSkew: number;
  };
}

/**
 * Advanced analytics panel
 */
export const AnalyticsPanel = ({ metrics }: AnalyticsPanelProps) => {
  if (!metrics) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-6 rounded-2xl shadow-lg">
      <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-600" />
        Statistical Insights
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase">
            Largest Department
          </p>
          <p className="text-lg font-bold text-indigo-600 mt-1">
            {metrics.largestDept.Department}
          </p>
          <p className="text-sm text-muted-foreground">
            {metrics.largestDept.Total_Students} students
          </p>
        </div>

        <div className="bg-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase">
            Smallest Department
          </p>
          <p className="text-lg font-bold text-green-600 mt-1">
            {metrics.smallestDept.Department}
          </p>
          <p className="text-sm text-muted-foreground">
            {metrics.smallestDept.Total_Students} students
          </p>
        </div>

        <div className="bg-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase">
            Median Students
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {metrics.median.toFixed(0)}
          </p>
        </div>

        <div className="bg-card p-4 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase">
            Std. Deviation
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            ±{metrics.standardDeviation.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-card rounded-xl">
        <p className="text-xs text-muted-foreground uppercase mb-2">
          Distribution Analysis
        </p>
        <p className="text-sm text-foreground">
          {metrics.distributionSkew > 0.5 ? (
            <>
              Distribution is{" "}
              <span className="font-bold text-red-600">right-skewed</span>: Few
              departments have significantly more students
            </>
          ) : metrics.distributionSkew < -0.5 ? (
            <>
              Distribution is{" "}
              <span className="font-bold text-blue-600">left-skewed</span>: Most
              departments are larger
            </>
          ) : (
            <>
              Distribution is{" "}
              <span className="font-bold text-green-600">fairly balanced</span>{" "}
              across departments
            </>
          )}
        </p>
      </div>
    </div>
  );
};
