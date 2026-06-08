import { useState } from "react";
import { Star } from "lucide-react";

export function HalfStarRating({
  value,
  onChange,
  size = 22,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
        const full = display >= n;
        const half = !full && display >= n - 0.5;
        return (
          <div key={n} className="relative cursor-pointer flex-shrink-0" style={{ width: size, height: size }}>
            <div
              className="absolute left-0 top-0 h-full z-10"
              style={{ width: "50%" }}
              onMouseEnter={() => setHover(n - 0.5)}
              onClick={() => onChange(n - 0.5)}
            />
            <div
              className="absolute right-0 top-0 h-full z-10"
              style={{ width: "50%" }}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n)}
            />
            <Star size={size} className="text-white/15 absolute inset-0" />
            {full && <Star size={size} className="text-amber-400 fill-amber-400 absolute inset-0" />}
            {half && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star size={size} className="text-amber-400 fill-amber-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
