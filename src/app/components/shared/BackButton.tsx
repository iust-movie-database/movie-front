import { ArrowLeft } from "lucide-react";
import { translations as t } from "../../../i18n/fa";

export function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 dark:bg-white/8 light:bg-white border border-white/15 dark:border-white/15 light:border-black/20 text-white/70 dark:text-white/70 light:text-black/70 hover:bg-white/12 dark:hover:bg-white/12 light:hover:bg-black/5 hover:text-white dark:hover:text-white light:hover:text-black transition-all text-sm font-medium"
    >
      <ArrowLeft size={16} />
      {t.detail.back}
    </button>
  );
}
