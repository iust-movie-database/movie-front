# Movie Website Implementation Plan

## Phase 1: Update Data Models
- Add `type` and `voteCount` to MovieData interface
- Add `type` and `releaseDate` to ComingSoonData interface
- Create TV_SERIES data array
- Update MOVIES with type and voteCount
- Update COMING_SOON with type and releaseDate

## Phase 2: Homepage Updates
- Add showTypeBadge prop to MovieCard component
- Update hero section with type badges
- Remove "See All" from Recommended section
- Add functional "See All" buttons that navigate to browse
- Add Top Rated Series section
- Update Coming Soon with release dates and type badges

## Phase 3: Discover Page
- Add all filter state variables
- Implement functional filters (genre, rating, sort, released toggle)
- Make search bar functional
- Fix pagination with filtered results
- Add genre pills section

## Phase 4: Detail Pages
- Add ArrowLeft icon import
- Create BackButton component
- Add back button to Movie and TV detail pages
- Update awards format with year
- Redesign layouts to horizontal cast/crew
- Update vote count display

## Phase 5: Profile Page
- Add watchlist filter tabs (All/Movies/TV)
- Add ratings/reviews pagination
- Create Edit Profile modal
- Create Edit Review modal
- Make delete buttons functional

Let's implement this systematically.
