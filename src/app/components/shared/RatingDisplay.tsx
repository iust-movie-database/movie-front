import { Star } from "lucide-react";
import { toPersianDigits } from "../../../i18n/fa";

export function RatingDisplay({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = { sm: "text-xs gap-0.5", md: "text-sm gap-1", lg: "text-lg gap-1.5" };
  const sz = { sm: 10, md: 13, lg: 16 };
  return (
    <span className={`flex items-center text-amber-400 font-semibold ${cls[size]}`}>
      <Star size={sz[size]} fill="currentColor" />
      {toPersianDigits(rating.toFixed(1))}
    </span>
  );
}
