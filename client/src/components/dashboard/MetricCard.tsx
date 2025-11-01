import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  trend?: number;
  subtitle?: string;
}

/**
 * Reusable metric card component with icon and trend support
 */
export const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}: MetricCardProps) => (
  <div className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h4>
        <p className={`text-4xl font-bold mt-3 ${color}`}>
          {typeof value === "number"
            ? isNaN(value)
              ? "-"
              : Math.round(value)
            : value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-sm text-green-600">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      {Icon && (
        <div
          className={`p-3 rounded-xl ${color
            .replace("text", "bg")
            .replace("600", "100")}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      )}
    </div>
  </div>
);
