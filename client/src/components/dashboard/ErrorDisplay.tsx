/**
 * Error display component with retry functionality
 */
interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => (
  <div className="p-8 bg-gradient-to-br from-destructive/10 to-destructive/5 min-h-screen flex items-center justify-center">
    <div className="bg-card p-8 rounded-2xl shadow-xl max-w-md text-center">
      <div className="text-destructive text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-foreground mb-2">
        Unable to Load Dashboard
      </h3>
      <p className="text-muted-foreground mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
      >
        Retry Connection
      </button>
    </div>
  </div>
);
