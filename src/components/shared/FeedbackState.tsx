import { Button } from '@/components/ui/button';

interface FeedbackStateProps {
  title: string;
  description?: string;
  tone?: 'neutral' | 'error';
  onRetry?: () => void;
}

export function FeedbackState({ title, description, tone = 'neutral', onRetry }: FeedbackStateProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="mx-auto flex min-h-40 w-full max-w-lg flex-col items-center justify-center gap-3 rounded-lg border bg-white p-6 text-center"
    >
      <h2 className={tone === 'error' ? 'font-semibold text-red-700' : 'font-semibold text-gray-800'}>{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {onRetry && <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
