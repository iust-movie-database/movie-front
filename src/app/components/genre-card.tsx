import { motion } from 'motion/react';

interface GenreCardProps {
  title: string;
  count: number;
  gradient: string;
  icon: React.ReactNode;
}

export function GenreCard({ title, count, gradient, icon }: GenreCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-8 rounded-3xl overflow-hidden cursor-pointer group ${gradient}`}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4 p-3 bg-white/20 backdrop-blur-xl rounded-2xl w-fit">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{count} عنوان</p>
      </div>

      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </motion.div>
  );
}
