const STAR_SVG = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function StarRating({
  value,
  onChange,
  hoverValue,
  onHover,
  placeholderLabel = "Tap to rate",
}: {
  value: number;
  onChange: (val: number) => void;
  hoverValue: number;
  onHover: (val: number) => void;
  placeholderLabel?: string;
}) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          type="button"
          className={`star ${value >= val ? "active" : ""} ${
            hoverValue >= val && value < val ? "hovered" : ""
          }`}
          onClick={() => onChange(val)}
          onMouseEnter={() => onHover(val)}
          onMouseLeave={() => onHover(0)}
        >
          {STAR_SVG}
        </button>
      ))}
      <span className="star-label">
        {value > 0 ? STAR_LABELS[value] : placeholderLabel}
      </span>
    </div>
  );
}
