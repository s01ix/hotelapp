import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { OpinionFormData } from './service/api';

interface OpinionFormProps {
  bookingId: number;
  roomId: number;
  roomName: string;
  onSubmit: (data: OpinionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: OpinionFormData;
}

export const OpinionForm: React.FC<OpinionFormProps> = ({
  bookingId,
  roomId,
  roomName,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [rate, setRate] = useState(initialData?.rate || 0);
  const [hoverRate, setHoverRate] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rate === 0) {
      setError('Proszę wybrać ocenę');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        bookingId,
        roomId,
        rate,
        comment: comment.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border p-8 max-w-2xl">
      <h3 className="text-2xl font-serif mb-2">Oceń swój pobyt</h3>
      <p className="text-muted-foreground text-sm mb-8 uppercase tracking-widest">{roomName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ocena gwiazdkami */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            Twoja ocena
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRate(star)}
                onMouseEnter={() => setHoverRate(star)}
                onMouseLeave={() => setHoverRate(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoverRate || rate)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rate > 0 && (
            <p className="text-sm text-gray-600 mt-2 font-serif">
              {rate === 1 && 'Bardzo słabo'}
              {rate === 2 && 'Słabo'}
              {rate === 3 && 'Średnio'}
              {rate === 4 && 'Dobrze'}
              {rate === 5 && 'Wspaniale'}
            </p>
          )}
        </div>

        {/* Komentarz */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-3">
            Twoja opinia (opcjonalnie)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-border p-4 min-h-[150px] focus:outline-none focus:border-primary resize-none"
            placeholder="Podziel się swoimi wrażeniami z pobytu..."
            maxLength={4000}
          />
          <p className="text-xs text-gray-400 mt-2">
            {comment.length} / 4000 znaków
          </p>
        </div>

        {/* Błąd */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm">
            {error}
          </div>
        )}

        {/* Przyciski */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-accent text-primary-foreground py-4 uppercase tracking-widest text-sm"
          >
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij opinię'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-4 uppercase tracking-widest text-sm"
          >
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  );
};