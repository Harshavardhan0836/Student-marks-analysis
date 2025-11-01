/**
 * Loading skeleton component
 */
export const LoadingSkeleton = () => (
  <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 min-h-screen">
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-muted rounded-lg w-1/3 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-6 rounded-2xl h-32"></div>
        ))}
      </div>
      <div className="bg-card p-6 rounded-2xl h-96"></div>
    </div>
  </div>
);
