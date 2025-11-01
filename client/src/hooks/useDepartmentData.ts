import { useState, useCallback } from "react";

interface DepartmentFilters {
  department?: string;
  semester?: string;
}

interface DepartmentData {
  total_students: number;
  avg_marks: number;
  data: any[];
}

interface UseDepartmentDataReturn {
  data: DepartmentData | null;
  loading: boolean;
  error: string | null;
  fetchData: (filters: DepartmentFilters) => Promise<void>;
  resetData: () => void;
}

/**
 * Hook to fetch and manage department analytics data
 */
export const useDepartmentData = (): UseDepartmentDataReturn => {
  const [data, setData] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (filters: DepartmentFilters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.department) params.append("department", filters.department);
      if (filters.semester) params.append("semester", filters.semester);

      const response = await fetch(
        `http://127.0.0.1:5000/api/department?${params.toString()}`
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching department data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchData, resetData };
};
