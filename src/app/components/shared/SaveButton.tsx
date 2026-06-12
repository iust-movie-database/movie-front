import { useState, useRef, useEffect } from "react";
import { Bookmark, BookmarkCheck, Clock, Eye, Check, ChevronDown, X } from "lucide-react";
import { translations as t } from "../../../i18n/fa";
import type { WatchlistStatus } from "../../../services/api";

const OPTIONS: { status: WatchlistStatus; label: string; icon: React.ReactNode }[] = [
  { status: "want_to_watch", label: t.detail.wantToWatch, icon: <Clock size={14} /> },
  { status: "watching", label: t.detail.watching, icon: <Eye size={14} /> },
  { status: "watched", label: t.detail.watched, icon: <Check size={14} /> },
];

interface SaveButtonProps {
  saved: boolean;
  status: WatchlistStatus | null;
  onToggle: () => void;
  onSelectStatus: (status: WatchlistStatus) => void;
  onRemove: () => void;
}

export function SaveButton({ saved, status, onToggle, onSelectStatus, onRemove }: SaveButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = OPTIONS.find((o) => o.status === status);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          if (!saved) {
            onToggle();
          } else {
            setOpen((v) => !v);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
            : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
        }`}
      >
        {saved ? (
          current ? current.icon : <BookmarkCheck size={16} />
        ) : (
          <Bookmark size={16} />
        )}
        {saved ? (current ? current.label : t.detail.saved) : t.detail.saveToWatchlist}
        {saved && <ChevronDown size={14} className={`mr-1 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && saved && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-card border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden min-w-[200px]">
          {OPTIONS.map((opt) => (
            <button
              key={opt.status}
              onClick={() => {
                onSelectStatus(opt.status);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-right transition-colors hover:bg-white/8 ${
                status === opt.status ? "text-primary" : "text-foreground/80"
              }`}
            >
              {opt.icon}
              {opt.label}
              {status === opt.status && <Check size={12} className="mr-auto text-primary" />}
            </button>
          ))}
          <div className="border-t border-white/8 mx-2" />
          <button
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/40 hover:text-primary hover:bg-primary/8 transition-colors"
          >
            <X size={14} />
            حذف از لیست
          </button>
        </div>
      )}
    </div>
  );
}