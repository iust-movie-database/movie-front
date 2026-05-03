#!/bin/bash

# Download all original Unsplash images used in Didar
# These are the EXACT images that were originally used

echo "Downloading original movie posters..."
curl -s "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" -o public/assets/movies/cinema.jpg
curl -s "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" -o public/assets/movies/film.jpg
curl -s "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80" -o public/assets/movies/night-city.jpg
curl -s "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80" -o public/assets/movies/tech.jpg
curl -s "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" -o public/assets/movies/space.jpg
curl -s "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=80" -o public/assets/movies/abstract.jpg
curl -s "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" -o public/assets/movies/urban.jpg
curl -s "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80" -o public/assets/movies/dark.jpg

echo "Downloading original banners..."
curl -s "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80" -o public/assets/banners/cinema-wide.jpg
curl -s "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80" -o public/assets/banners/film-wide.jpg
curl -s "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80" -o public/assets/banners/theater-wide.jpg
curl -s "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&q=80" -o public/assets/banners/night-wide.jpg

echo "Downloading original actor photos..."
curl -s "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" -o public/assets/actors/actor-1.jpg
curl -s "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" -o public/assets/actors/actor-2.jpg
curl -s "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" -o public/assets/actors/actor-3.jpg
curl -s "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" -o public/assets/actors/actor-4.jpg

echo "Downloading original avatars..."
curl -s "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" -o public/assets/avatars/user-1.jpg
curl -s "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" -o public/assets/avatars/user-2.jpg
curl -s "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" -o public/assets/avatars/user-3.jpg
curl -s "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80" -o public/assets/avatars/user-4.jpg

echo "Download complete! All original images restored."
