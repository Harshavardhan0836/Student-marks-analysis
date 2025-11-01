import { useEffect, useState } from "react";
import axios from "axios";

interface OverviewData {
  total_students: number;
  total_departments: number;
  avg_marks: number;
  students_per_department: Array<{
    Department: string;
    Total_Students: number;
  }>;
}

interface UseOverviewDataReturn {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching overview dashboard data
 * Implements retry logic, request cancellation, and proper error handling
 */
export const useOverviewData = (
  endpoint = "http://127.0.0.1:5000/api/overview"
): UseOverviewDataReturn => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let retryCount = 0;
    const maxRetries = 3;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<OverviewData>(endpoint, {
          signal: controller.signal,
          timeout: 10000,
        });

        if (!response.data) {
          throw new Error("Invalid response structure");
        }

        setData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
          return;
        }

        // Retry logic for network errors
        if (retryCount < maxRetries && err.code === "ECONNABORTED") {
          retryCount++;
          console.warn(`Retry attempt ${retryCount}/${maxRetries}`);
          setTimeout(fetchData, 1000 * retryCount);
          return;
        }

        setError(err.message || "Failed to load dashboard data");
        console.error("❌ Error loading overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [endpoint]);

  return { data, loading, error };
};
