import { X } from "lucide-react";

export function FilterChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/15 dark:bg-primary/15 light:bg-primary/10 border border-primary/40 dark:border-primary/40 light:border-primary/50 text-primary rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-accent dark:hover:text-accent light:hover:text-primary/80 transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
