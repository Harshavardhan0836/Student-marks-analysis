/**
 * Formatting utility functions
 */

/**
 * Format numbers with proper localization and abbreviation
 */
export const formatNumber = (num: number, decimals = 0): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(decimals);
};

/**
 * Color palette generator for charts
 */
export const getColorPalette = (): string[] => [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];
