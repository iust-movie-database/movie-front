export function SectionHeader({ title, action, onActionClick }: { title: string; action?: string; onActionClick?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2
        className="text-[22px] font-bold text-white tracking-wide"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      >
        {title}
      </h2>
      {action && (
        <button onClick={onActionClick} className="text-primary text-sm font-medium hover:text-red-400 transition-colors">
          {action} ←
        </button>
      )}
    </div>
  );
}
