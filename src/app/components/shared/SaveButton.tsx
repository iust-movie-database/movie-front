import { Bookmark, BookmarkCheck } from "lucide-react";
import { translations as t } from "../../../i18n/fa";

export function SaveButton({ saved, onToggle }: { saved: boolean; onToggle?: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
        saved
          ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
          : "bg-white/8 dark:bg-white/8 light:bg-white border-white/15 dark:border-white/15 light:border-black/20 text-foreground hover:bg-white/15 dark:hover:bg-white/15 light:hover:bg-black/5"
      }`}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? t.detail.saved : t.detail.save}
    </button>
  );
}
