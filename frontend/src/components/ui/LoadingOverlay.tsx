interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-paper border-2 border-cream-dark rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium text-ink">{message}</p>
        </div>
      </div>
    </div>
  );
}
