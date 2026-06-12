// src/app/components/WatchlistModal.tsx
import { X, List, Check, TvMinimalPlay } from "lucide-react";
import { translations as t } from "../../i18n/fa";
import type { WatchlistStatus } from "../../services/api";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (status: WatchlistStatus) => void;
  currentStatus: WatchlistStatus | null;
  titleName: string;
}

const options: { id: WatchlistStatus; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    id: 'want_to_watch', 
    label: t.detail.wantToWatch, 
    icon: <List size={18} />,
    description: 'عنوان‌هایی که قصد دارید در آینده تماشا کنید',
    color: 'text-blue-400'
  },
  { 
    id: 'watching', 
    label: t.detail.watching, 
    icon: <TvMinimalPlay size={18} />,
    description: 'عنوان‌هایی که در حال حاضر در حال تماشای آن هستید',
    color: 'text-yellow-400'
  },
  { 
    id: 'watched', 
    label: t.detail.watched, 
    icon: <Check size={18} />,
    description: 'عنوان‌هایی که مشاهده کرده‌اید',
    color: 'text-green-400'
  },
];

export function WatchlistModal({ isOpen, onClose, onSelect, currentStatus, titleName }: WatchlistModalProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-white/15 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {t.detail.selectListType}
            </h3>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-white/40 text-sm mt-2">
            {titleName}
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left ${
                currentStatus === option.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`mt-0.5 ${option.color}`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    currentStatus === option.id ? 'text-primary' : 'text-white'
                  }`}>
                    {option.label}
                  </span>
                  {currentStatus === option.id && (
                    <Check size={14} className="text-primary" />
                  )}
                </div>
                <p className="text-white/35 text-xs mt-1">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm font-medium transition-colors"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}