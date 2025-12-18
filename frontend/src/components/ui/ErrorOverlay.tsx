import { Button } from './Button';

interface ErrorOverlayProps {
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function ErrorOverlay({
  title,
  message,
  buttonText = 'Go Back',
  onButtonClick,
}: ErrorOverlayProps) {
  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-paper border-2 border-red-300 rounded-lg p-8 shadow-2xl max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-serif font-semibold text-ink">{title}</h2>
          <p className="text-slate-lighter text-center">{message}</p>
          {onButtonClick && (
            <Button onClick={onButtonClick} className="px-6 py-3">
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
