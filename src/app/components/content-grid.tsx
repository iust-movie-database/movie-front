import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { MovieCard } from './movie-card';
import { OptimizedImage } from './optimized-image';
import { Star, ThumbsUp, MessageCircle, Calendar, Film } from 'lucide-react';
import { LayoutType } from './layout-switcher';

interface ContentItem {
  id: string | number;
  title: string;
  titleEn?: string;
  year: number;
  rating: number;
  genre?: string;
  poster: string;
  type?: 'movie' | 'series';
  [key: string]: any;
}

interface ContentGridProps {
  items: ContentItem[];
  layout: LayoutType;
  baseUrl?: string;
}

export function ContentGrid({ items, layout, baseUrl = '/movie' }: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-2xl font-bold mb-3">موردی یافت نشد</h3>
        <p className="text-muted-foreground mb-6">
          نتیجه‌ای با این فیلتر پیدا نشد. لطفاً فیلترها را تغییر دهید.
        </p>
      </div>
    );
  }

  switch (layout) {
    case 'poster-grid':
      return <PosterGrid items={items} baseUrl={baseUrl} />;
    case 'large-grid':
      return <LargeGrid items={items} baseUrl={baseUrl} />;
    case 'detailed-list':
      return <DetailedList items={items} baseUrl={baseUrl} />;
    case 'compact-list':
      return <CompactList items={items} baseUrl={baseUrl} />;
    case 'magazine':
      return <MagazineView items={items} baseUrl={baseUrl} />;
    case 'masonry':
      return <MasonryView items={items} baseUrl={baseUrl} />;
    case 'timeline':
      return <TimelineView items={items} baseUrl={baseUrl} />;
    default:
      return <PosterGrid items={items} baseUrl={baseUrl} />;
  }
}

function PosterGrid({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Link to={`${baseUrl}/${item.id}`}>
              <MovieCard {...item} />
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function LargeGrid({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`${baseUrl}/${item.id}`}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-muted mb-4">
                  <OptimizedImage
                    src={item.poster}
                    alt={item.title}
                    type="movie"
                    index={item.id}
                    title={item.title}
                    subtitle={item.titleEn}
                    year={item.year}
                    rating={item.rating}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-white font-bold">{item.rating}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="text-muted-foreground">{item.titleEn}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.year} • {item.genre}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailedList({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to={`${baseUrl}/${item.id}`}
              className="flex items-center gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group"
            >
              <OptimizedImage
                src={item.poster}
                alt={item.title}
                type="movie"
                index={item.id}
                title={item.title}
                subtitle={item.titleEn}
                year={item.year}
                rating={item.rating}
                className="w-24 h-36 rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="text-muted-foreground mb-3">{item.titleEn}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-bold text-accent">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{item.year}</span>
                  </div>
                  {item.genre && <span>{item.genre}</span>}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function CompactList({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div layout className="space-y-2">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              to={`${baseUrl}/${item.id}`}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
            >
              <OptimizedImage
                src={item.poster}
                alt={item.title}
                type="movie"
                index={item.id}
                title={item.title}
                subtitle={item.titleEn}
                year={item.year}
                rating={item.rating}
                className="w-12 h-18 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="text-sm text-muted-foreground truncate">{item.titleEn}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-medium text-accent">{item.rating}</span>
                </div>
                <span className="text-muted-foreground">{item.year}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function MagazineView({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div layout className="space-y-12">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              to={`${baseUrl}/${item.id}`}
              className={`group block ${index % 2 === 0 ? 'md:pr-20' : 'md:pl-20'}`}
            >
              <div className="relative">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-muted mb-6">
                  <OptimizedImage
                    src={item.poster}
                    alt={item.title}
                    type="banner"
                    index={item.id}
                    title={item.title}
                    subtitle={item.titleEn}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{item.rating}</div>
                    <Star className="w-4 h-4 fill-white text-white mx-auto" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h2>
              <div className="text-xl text-muted-foreground mb-4">{item.titleEn}</div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{item.year}</span>
                <span>•</span>
                <span>{item.genre}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function MasonryView({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div
      layout
      className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="break-inside-avoid mb-6"
          >
            <Link to={`${baseUrl}/${item.id}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden bg-muted mb-3" style={{ aspectRatio: Math.random() > 0.5 ? '2/3' : '3/4' }}>
                <OptimizedImage
                  src={item.poster}
                  alt={item.title}
                  type="movie"
                  index={item.id}
                  title={item.title}
                  subtitle={item.titleEn}
                  year={item.year}
                  rating={item.rating}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-white font-bold">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <div className="text-sm text-muted-foreground">{item.year}</div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineView({ items, baseUrl }: { items: ContentItem[]; baseUrl: string }) {
  return (
    <motion.div layout className="relative">
      <div className="absolute right-8 top-0 bottom-0 w-px bg-border" />
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative pr-20 pb-12"
          >
            <div className="absolute right-[26px] top-2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
            <div className="text-sm font-bold text-primary mb-2">{item.year}</div>
            <Link
              to={`${baseUrl}/${item.id}`}
              className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all group"
            >
              <OptimizedImage
                src={item.poster}
                alt={item.title}
                type="movie"
                index={item.id}
                title={item.title}
                subtitle={item.titleEn}
                year={item.year}
                rating={item.rating}
                className="w-20 h-30 rounded-xl"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="text-sm text-muted-foreground mb-2">{item.titleEn}</div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-accent font-medium">{item.rating}</span>
                  </div>
                  {item.genre && <span className="text-muted-foreground">{item.genre}</span>}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
