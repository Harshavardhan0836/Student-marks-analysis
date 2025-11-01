/**
 * Analytics utility functions for calculating metrics and statistics
 */

interface PerformanceStats {
  avg: number;
  min: number;
  max: number;
  median: number;
}

interface PerformanceMetrics {
  total: PerformanceStats;
  external: PerformanceStats;
  internal: PerformanceStats;
}

interface SubjectResults {
  [key: string]: {
    passed: number;
    failed: number;
    total: number;
    passRate: string;
    rate: number;
  };
}

interface SubjectAverage {
  subject: string;
  code: string;
  average: number;
  count: number;
}

interface Performer {
  name: string;
  marks: number;
  seat: string;
}

interface Performers {
  top: Performer[];
  bottom: Performer[];
}

/**
 * Calculate comprehensive student performance metrics
 */
export const calculatePerformanceMetrics = (
  students: any[]
): PerformanceMetrics | null => {
  if (!students || students.length === 0) return null;

  const totalMarks = students
    .map((s) => s.Grand_Total_Marks)
    .filter((m) => m != null);
  const externalMarks = students
    .map((s) => s.Total_External_Marks)
    .filter((m) => m != null);
  const internalMarks = students
    .map((s) => s.Total_Internal_Marks)
    .filter((m) => m != null);

  const calculateStats = (arr: number[]): PerformanceStats => {
    if (arr.length === 0)
      return { avg: 0, min: 0, max: 0, median: 0 };
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return {
      avg: arr.reduce((sum, val) => sum + val, 0) / arr.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median:
        sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    };
  };

  return {
    total: calculateStats(totalMarks),
    external: calculateStats(externalMarks),
    internal: calculateStats(internalMarks),
  };
};

/**
 * Analyze pass/fail rates across subjects
 */
export const analyzePassFailRates = (students: any[]): SubjectResults | null => {
  if (!students || students.length === 0) return null;

  const subjectResults: SubjectResults = {};
  const maxSubjects = 9;

  for (let i = 1; i <= maxSubjects; i++) {
    const resultKey = `Result_${i}`;
    const subjectKey = `Subject_Name_${i}`;

    const results = students
      .filter((s) => s[resultKey] != null)
      .map((s) => ({
        result: s[resultKey],
        subject: s[subjectKey],
      }));

    if (results.length > 0) {
      const subject = results[0].subject || `Subject ${i}`;
      const passed = results.filter((r) => r.result === "P").length;
      const failed = results.filter((r) => r.result === "F").length;
      const rate = (passed / (passed + failed)) * 100;

      subjectResults[subject] = {
        passed,
        failed,
        total: passed + failed,
        passRate: rate.toFixed(1),
        rate: parseFloat(rate.toFixed(1)),
      };
    }
  }

  return subjectResults;
};

/**
 * Calculate subject-wise average marks
 */
export const calculateSubjectAverages = (students: any[]): SubjectAverage[] => {
  if (!students || students.length === 0) return [];

  const subjectData: { [key: string]: SubjectAverage } = {};
  const maxSubjects = 9;

  for (let i = 1; i <= maxSubjects; i++) {
    const totalKey = `Total_Marks_${i}`;
    const subjectKey = `Subject_Name_${i}`;
    const codeKey = `Subject_Code_${i}`;

    const marks = students
      .filter((s) => s[totalKey] != null && !isNaN(s[totalKey]))
      .map((s) => ({
        mark: s[totalKey],
        subject: s[subjectKey],
        code: s[codeKey],
      }));

    if (marks.length > 0) {
      const subject = marks[0].subject || `Subject ${i}`;
      const code = marks[0].code || "";
      const avg = marks.reduce((sum, m) => sum + m.mark, 0) / marks.length;

      subjectData[subject] = {
        subject: subject.substring(0, 20),
        code,
        average: parseFloat(avg.toFixed(2)),
        count: marks.length,
      };
    }
  }

  return Object.values(subjectData);
};

/**
 * Identify top and bottom performers
 */
export const getPerformers = (students: any[], count = 5): Performers => {
  if (!students || students.length === 0)
    return { top: [], bottom: [] };

  const validStudents = students
    .filter((s) => s.Grand_Total_Marks != null)
    .map((s) => ({
      name: s.Student_Name,
      marks: s.Grand_Total_Marks,
      seat: s.University_Seat_Number,
    }))
    .sort((a, b) => b.marks - a.marks);

  return {
    top: validStudents.slice(0, Math.min(count, validStudents.length)),
    bottom: validStudents
      .slice(-Math.min(count, validStudents.length))
      .reverse(),
  };
};

/**
 * Calculate median from array
 */
export const calculateMedian = (arr: number[]): number => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate standard deviation
 */
export const calculateStdDev = (arr: number[]): number => {
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const squaredDiffs = arr.map((val) => Math.pow(val - mean, 2));
  return Math.sqrt(
    squaredDiffs.reduce((sum, val) => sum + val, 0) / arr.length
  );
};

/**
 * Calculate skewness
 */
export const calculateSkewness = (arr: number[]): number => {
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const stdDev = calculateStdDev(arr);
  const n = arr.length;
  const cubeSum = arr.reduce(
    (sum, val) => sum + Math.pow((val - mean) / stdDev, 3),
    0
  );
  return (n / ((n - 1) * (n - 2))) * cubeSum;
};

/**
 * Calculate derived metrics for advanced analytics
 */
export const calculateDerivedMetrics = (data: any) => {
  if (!data?.students_per_department) return null;

  const departments = data.students_per_department;
  const studentCounts = departments.map((d: any) => d.Total_Students);

  return {
    median: calculateMedian(studentCounts),
    standardDeviation: calculateStdDev(studentCounts),
    largestDept: departments.reduce((max: any, d: any) =>
      d.Total_Students > max.Total_Students ? d : max
    ),
    smallestDept: departments.reduce((min: any, d: any) =>
      d.Total_Students < min.Total_Students ? d : min
    ),
    distributionSkew: calculateSkewness(studentCounts),
  };
};
