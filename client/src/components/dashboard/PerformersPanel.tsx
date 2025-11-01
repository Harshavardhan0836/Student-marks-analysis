import { TrendingUp, AlertCircle } from "lucide-react";

interface Performer {
  name: string;
  marks: number;
  seat: string;
}

interface PerformersPanelProps {
  performers: {
    top: Performer[];
    bottom: Performer[];
  };
}

/**
 * Top/Bottom performers panel
 */
export const PerformersPanel = ({ performers }: PerformersPanelProps) => {
  if (!performers) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Performers */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h4 className="text-xl font-semibold text-foreground">
            Top Performers
          </h4>
        </div>
        <div className="space-y-3">
          {performers.top.map((student, i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center font-bold text-green-600">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.seat}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {student.marks}
                </p>
                <p className="text-xs text-muted-foreground">marks</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Performers */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h4 className="text-xl font-semibold text-foreground">
            Needs Attention
          </h4>
        </div>
        <div className="space-y-3">
          {performers.bottom.map((student, i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center font-bold text-orange-600">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.seat}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  {student.marks}
                </p>
                <p className="text-xs text-muted-foreground">marks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
