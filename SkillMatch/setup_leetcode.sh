#!/bin/bash

# Create the data directory if it doesn't exist
echo "Creating data directory..."
mkdir -p database/data/json

# Copy the leetcode_problems.json file (if needed)
if [ ! -f database/data/json/leetcode_problems.json ]; then
  echo "Creating example leetcode_problems.json file..."
  # The seeder will create this file if it doesn't exist
fi

# Run the migrations
echo "Running migrations..."
php artisan migrate

# Run the seeder
echo "Running LeetcodeProblemSeeder..."
php artisan db:seed --class=LeetcodeProblemSeeder

echo "Setup complete!"
echo "You can now access the LeetCode problems at /api/leetcode/problems"
