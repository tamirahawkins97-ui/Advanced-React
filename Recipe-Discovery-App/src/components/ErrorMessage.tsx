interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message = 'An unexpected error occurred.', onRetry }: ErrorMessageProps) {
  return (
    <div className="error-card" role="alert">
      <span className="error-card__symbol">!</span>
      <h3 className="error-card__title">Unable to Load Content</h3>
      <p className="error-card__message">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn--outline">
          Try Again
        </button>
      )}
    </div>
  );
}