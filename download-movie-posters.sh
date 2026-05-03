#!/bin/bash

# Download specific movie posters matching titles
cd /workspaces/default/code/public/assets/movies

# Interstellar
curl -L "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop" -o interstellar.jpg

# Batman / Dark Knight
curl -L "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop" -o batman.jpg

# Inception
curl -L "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop" -o inception.jpg

# Godfather
curl -L "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop" -o godfather.jpg

# Shawshank
curl -L "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop" -o shawshank.jpg

# Pulp Fiction
curl -L "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop" -o pulp-fiction.jpg

# Matrix
curl -L "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop" -o matrix.jpg

# Fight Club
curl -L "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop" -o fight-club.jpg

# Oppenheimer
curl -L "https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=400&h=600&fit=crop" -o oppenheimer.jpg

# Dune
curl -L "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&h=600&fit=crop" -o dune.jpg

# Joker
curl -L "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=600&fit=crop" -o joker.jpg

# Series covers
cd /workspaces/default/code/public/assets/series

# Breaking Bad
curl -L "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=600&fit=crop" -o breaking-bad.jpg

# Dark
curl -L "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop" -o dark.jpg

# Game of Thrones
curl -L "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop" -o game-of-thrones.jpg

# Stranger Things
curl -L "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&h=600&fit=crop" -o stranger-things.jpg

# The Crown
curl -L "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop" -o the-crown.jpg

echo "Download complete!"
