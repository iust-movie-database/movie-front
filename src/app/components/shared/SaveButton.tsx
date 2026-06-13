import { useState, useRef, useEffect } from "react";
import { Bookmark, BookmarkCheck, Eye, Clock, Check, ChevronDown, X } from "lucide-react";
import { translations as t } from "../../../i18n/fa";
import type { WatchlistStatus } from "../../../services/api";

const OPTIONS: { status: WatchlistStatus; label: string; icon: React.ReactNode }[] = [
  { status: "want_to_watch", label: t.profile.wantToWatch, icon: <Clock size={14} /> },
  { status: "watching",    label: t.profile.watching,    icon: <Eye size={14} /> },
  { status: "watched",     label: t.profile.watched,     icon: <Check size={14} /> },
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

  const current = OPTIONS.find((o) => o.status === status) ?? null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
          current
            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
            : "bg-white/8 dark:bg-white/8 light:bg-white border-white/15 dark:border-white/15 light:border-black/20 text-foreground hover:bg-white/15 dark:hover:bg-white/15 light:hover:bg-black/5"
        }`}
      >
        {current ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {current ? current.label : t.detail.saveToWatchlist}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-card border border-white/15 dark:border-white/15 light:border-black/20 rounded-xl shadow-2xl shadow-black/60 overflow-hidden min-w-[180px]">
          {OPTIONS.map((opt) => (
            <button
              key={opt.status}
              onClick={() => { onSelectStatus(opt.status); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-right transition-colors hover:bg-white/8 dark:hover:bg-white/8 light:hover:bg-black/5 ${
                status === opt.status ? "text-primary" : "text-foreground/80"
              }`}
            >
              {opt.icon}
              {opt.label}
              {status === opt.status && <Check size={12} className="mr-auto text-primary" />}
            </button>
          ))}
          {current && (
            <>
              <div className="border-t border-white/8 dark:border-white/8 light:border-black/8 mx-2" />
              <button
                onClick={() => { onRemove(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/40 dark:text-white/40 light:text-black/40 hover:text-primary hover:bg-primary/8 transition-colors"
              >
                <X size={14} />
                {t.profile.unsave}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}