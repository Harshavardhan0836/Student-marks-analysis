import { Filter, Search, X, RefreshCw } from "lucide-react";

interface FilterPanelProps {
  departments: string[];
  filters: {
    department: string;
    semester: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onApply: () => void;
  onReset: () => void;
  loading: boolean;
}

/**
 * Enhanced filter panel with validation
 */
export const FilterPanel = ({
  departments,
  filters,
  onFilterChange,
  onApply,
  onReset,
  loading,
}: FilterPanelProps) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">
          Filter Options
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Department Selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition bg-background text-foreground"
          >
            <option value="">All Departments</option>
            {departments.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Semester
          </label>
          <input
            type="number"
            min="1"
            max="8"
            placeholder="e.g., 1"
            value={filters.semester}
            onChange={(e) => onFilterChange("semester", e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition bg-background text-foreground"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={onApply}
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Apply
              </>
            )}
          </button>
          <button
            onClick={onReset}
            disabled={loading}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
