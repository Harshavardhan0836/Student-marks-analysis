/**
 * Custom tooltip for enhanced chart interactivity
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card p-4 rounded-xl shadow-2xl border border-border">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.name}:{" "}
            <span className="font-bold text-foreground">{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
};
