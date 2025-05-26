@echo off
echo Creating data directory...
if not exist database\data\json mkdir database\data\json

echo Running migrations...
php artisan migrate

echo Running LeetcodeProblemSeeder...
php artisan db:seed --class=LeetcodeProblemSeeder

echo Setup complete!
echo You can now access the LeetCode problems at /api/leetcode/problems
pause
