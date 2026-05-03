import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface ActorCardProps {
  name: string;
  nameEn: string;
  image: string;
  moviesCount: number;
  id?: string | number;
}

export function ActorCard({ name, nameEn, image, moviesCount, id = 1 }: ActorCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/actor/${id}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-xl rounded-full">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white">
                {moviesCount} فیلم
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="text-sm text-muted-foreground">{nameEn}</div>
      </div>
    </motion.div>
  );
}
