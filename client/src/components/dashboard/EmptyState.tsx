import { BookOpen } from "lucide-react";

/**
 * Empty state component for when no data is available
 */
export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <BookOpen className="w-20 h-20 text-muted mb-4" />
    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
      No Data Yet
    </h3>
    <p className="text-muted-foreground text-center max-w-md">
      Select a department and semester from the filters above to view detailed
      analytics
    </p>
  </div>
);
