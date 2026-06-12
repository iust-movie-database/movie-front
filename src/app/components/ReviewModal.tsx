import { useState, useEffect } from "react";
import { X, Star, AlertTriangle } from "lucide-react";
import { translations as t, toPersianDigits } from "../../i18n/fa";
import { HalfStarRating } from "./shared";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: number;
  titleName: string;
  titleImg?: string;
  titleType: "Movie" | "TV";
  existingReview?: {
    rating: number;
    reviewText: string;
  } | null;
  onSubmit: (data: { rating: number; reviewText: string }) => void;
  isLoggedIn: boolean;
  onAuthRequest: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  titleName,
  existingReview,
  onSubmit,
  isLoggedIn,
  onAuthRequest,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingError, setRatingError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!isLoggedIn) {
        onClose();
        onAuthRequest();
        return;
      }
      setRating(existingReview?.rating ?? 0);
      setReviewText(existingReview?.reviewText ?? "");
      setRatingError(false);
    }
  }, [isOpen, existingReview, isLoggedIn]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    onSubmit({ rating, reviewText });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-white/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">
                {existingReview ? "ویرایش نقد" : "نوشتن نقد"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-white/40 text-sm mt-2">{titleName}</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/60 text-sm font-medium">
                امتیاز شما <span className="text-primary">*</span>
              </label>
              {rating > 0 && (
                <span className="text-amber-400 text-sm font-semibold">
                  {toPersianDigits(rating)} از ۱۰
                </span>
              )}
            </div>
            <HalfStarRating value={rating} onChange={setRating} size={28} />
            {ratingError && (
              <p className="text-primary text-xs mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> انتخاب امتیاز الزامی است
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-white/60 text-sm font-medium mb-2">
              متن نقد
            </label>
            <textarea
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="نظر خود را درباره این فیلم یا سریال بنویسید..."
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/40 transition-colors resize-none"
            />
            <p className="text-white/25 text-xs mt-1 text-left">
              {reviewText.length} / ۱۰۰۰ کاراکتر
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-white/5">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white/8 border border-white/15 text-white/70 rounded-xl text-sm font-medium hover:bg-white/12 transition-all"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-accent transition-all shadow-lg shadow-primary/30"
            >
              {existingReview ? "ویرایش نقد" : "ثبت نقد"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}