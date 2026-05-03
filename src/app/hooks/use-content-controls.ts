import { useState, useEffect, useMemo } from 'react';

interface ContentItem {
  id: string | number;
  title: string;
  titleEn?: string;
  year: number;
  rating: number;
  genre?: string;
  genres?: string[];
  type?: string;
  poster: string;
  [key: string]: any;
}

interface Filters {
  contentType?: string[];
  genres?: string[];
  ratingRange?: [number, number];
  reviewType?: string[];
  length?: string[];
  spoiler?: string;
  dateFilter?: string;
  popularity?: string;
  yearRange?: [number, number];
}

export function useContentControls<T extends ContentItem>(
  initialItems: T[],
  storageKey: string = 'content-controls'
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}-sort`);
    return saved || 'popular';
  });
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}-layout`);
    return (saved as any) || 'poster-grid';
  });
  const [filters, setFilters] = useState<Filters>({});

  // Save preferences
  useEffect(() => {
    localStorage.setItem(`${storageKey}-sort`, sortBy);
  }, [sortBy, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-layout`, layout);
  }, [layout, storageKey]);

  // Filter logic
  const filteredItems = useMemo(() => {
    let filtered = [...initialItems];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.titleEn?.toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      filtered = filtered.filter((item) => {
        const itemGenres = item.genre?.split('،').map((g) => g.trim()) || item.genres || [];
        return filters.genres!.some((genre) =>
          itemGenres.some((ig) => ig.includes(genre) || genre.includes(ig))
        );
      });
    }

    // Rating filter
    if (filters.ratingRange) {
      filtered = filtered.filter(
        (item) =>
          item.rating >= filters.ratingRange![0] &&
          item.rating <= filters.ratingRange![1]
      );
    }

    // Year range filter
    if (filters.yearRange) {
      filtered = filtered.filter(
        (item) =>
          item.year >= filters.yearRange![0] &&
          item.year <= filters.yearRange![1]
      );
    }

    // Content type filter
    if (filters.contentType && filters.contentType.length > 0) {
      filtered = filtered.filter((item) =>
        filters.contentType!.includes(item.type || 'movie')
      );
    }

    return filtered;
  }, [initialItems, searchQuery, filters]);

  // Sort logic
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'oldest':
        return sorted.sort((a, b) => a.year - b.year);
      case 'highest-rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest-rated':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'a-z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
      case 'z-a':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'fa'));
      case 'most-liked':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'most-commented':
        return sorted.sort((a, b) => (b.comments || 0) - (a.comments || 0));
      case 'trending':
        return sorted.sort((a, b) => (b.trending || 0) - (a.trending || 0));
      case 'random':
        return sorted.sort(() => Math.random() - 0.5);
      case 'popular':
      default:
        // Keep original order for popular
        return sorted;
    }
  }, [filteredItems, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.genres?.length) count += filters.genres.length;
    if (filters.ratingRange && (filters.ratingRange[0] > 1 || filters.ratingRange[1] < 10)) count += 1;
    if (filters.yearRange) count += 1;
    if (filters.contentType?.length && filters.contentType.length < 2) count += 1;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return {
    items: sortedItems,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    layout,
    setLayout,
    filters,
    setFilters,
    activeFilterCount,
    clearFilters,
    resultCount: sortedItems.length,
    totalCount: initialItems.length,
  };
}
