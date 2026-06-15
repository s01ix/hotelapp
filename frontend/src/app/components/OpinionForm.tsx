import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { OpinionFormData } from './service/api';
import { useTranslation } from 'react-i18next'; 

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
  const { t } = useTranslation(); 
  const [rate, setRate] = useState(initialData?.rate || 0);
  const [hoverRate, setHoverRate] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rate === 0) {
      setError(t('opinionForm.ratingRequired'));
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
      setError(err instanceof Error ? err.message : t('opinionForm.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border p-8 max-w-2xl">
      <h3 className="text-2xl font-serif mb-2">{t('opinionForm.title')}</h3>
      <p className="text-muted-foreground text-sm mb-8 uppercase tracking-widest">{roomName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ocena gwiazdkami */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            {t('opinionForm.yourRating')}
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
              {rate === 1 && t('opinionForm.ratings.1')}
              {rate === 2 && t('opinionForm.ratings.2')}
              {rate === 3 && t('opinionForm.ratings.3')}
              {rate === 4 && t('opinionForm.ratings.4')}
              {rate === 5 && t('opinionForm.ratings.5')}
            </p>
          )}
        </div>

        {/* Komentarz */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-3">
            {t('opinionForm.yourOpinion')}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-border p-4 min-h-[150px] focus:outline-none focus:border-primary resize-none"
            placeholder={t('opinionForm.opinionPlaceholder')}
            maxLength={4000}
          />
          <p className="text-xs text-gray-400 mt-2">
            {comment.length} / 4000 {t('opinionForm.chars')}
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
            {isSubmitting ? t('opinionForm.submitting') : t('opinionForm.submitBtn')}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-4 uppercase tracking-widest text-sm"
          >
            {t('opinionForm.cancelBtn')}
          </Button>
        </div>
      </form>
    </div>
  );
};