import { Grid3x3, LayoutGrid, List, Columns, Grid2x2, LayoutList, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export type LayoutType = 'poster-grid' | 'large-grid' | 'detailed-list' | 'compact-list' | 'magazine' | 'masonry' | 'timeline';

interface LayoutSwitcherProps {
  value: LayoutType;
  onChange: (value: LayoutType) => void;
}

export function LayoutSwitcher({ value, onChange }: LayoutSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const layouts = [
    { value: 'poster-grid' as LayoutType, label: 'شبکه پوستر', icon: <Grid3x3 className="w-4 h-4" /> },
    { value: 'large-grid' as LayoutType, label: 'شبکه بزرگ', icon: <Grid2x2 className="w-4 h-4" /> },
    { value: 'detailed-list' as LayoutType, label: 'لیست تفصیلی', icon: <LayoutList className="w-4 h-4" /> },
    { value: 'compact-list' as LayoutType, label: 'لیست فشرده', icon: <List className="w-4 h-4" /> },
    { value: 'magazine' as LayoutType, label: 'مجله‌ای', icon: <LayoutGrid className="w-4 h-4" /> },
    { value: 'masonry' as LayoutType, label: 'آجری', icon: <Columns className="w-4 h-4" /> },
    { value: 'timeline' as LayoutType, label: 'زمانی', icon: <Clock className="w-4 h-4" /> },
  ];

  const currentLayout = layouts.find((l) => l.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all"
        title={currentLayout?.label}
      >
        {currentLayout?.icon}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {layouts.map((layout) => (
                <button
                  key={layout.value}
                  onClick={() => {
                    onChange(layout.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors ${
                    value === layout.value ? 'text-primary bg-primary/10' : ''
                  }`}
                >
                  {layout.icon}
                  <span className="text-sm">{layout.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
