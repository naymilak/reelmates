import { useState } from 'react';

type Props = {
  title: string;
  initialRating?: number;
  onConfirm: (rating: number) => Promise<void>;
  onClose: () => void;
};

export function RatingModal({ title, initialRating, onConfirm, onClose }: Props) {
  const [rating, setRating] = useState(initialRating ?? 8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onConfirm(rating);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save rating.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="rating-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rating-title">{initialRating ? 'Edit rating' : 'Rate this movie'}</h2>
        <p className="modal-sub">{title}</p>
        <form onSubmit={handleSubmit}>
          <label className="rating-label" htmlFor="rating">
            Your rating (1–10)
          </label>
          <input
            id="rating"
            type="range"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <p className="rating-value" aria-live="polite">
            {rating} / 10
          </p>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
