import { useEffect, useState } from "react";

interface UseDepartmentListReturn {
  departments: string[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch department list from overview endpoint
 */
export const useDepartmentList = (): UseDepartmentListReturn => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/overview");
        if (!response.ok) throw new Error("Failed to fetch departments");

        const data = await response.json();

        if (data?.students_per_department) {
          const depts = data.students_per_department.map(
            (d: any) => d.Department
          );
          setDepartments(depts);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
};
