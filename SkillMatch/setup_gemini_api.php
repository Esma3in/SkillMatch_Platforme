<?php
/**
 * Gemini API Key Setup Script
 *
 * This script helps set up the Gemini API key in your .env file.
 *
 * Usage:
 * php setup_gemini_api.php YOUR_API_KEY_HERE
 */

// Check if API key is provided
if ($argc < 2) {
    echo "Error: Please provide your Gemini API key as a parameter.\n";
    echo "Usage: php setup_gemini_api.php YOUR_API_KEY_HERE\n";
    exit(1);
}

$apiKey = $argv[1];

// Path to .env file
$envFile = __DIR__ . '/.env';

if (!file_exists($envFile)) {
    echo "Error: .env file not found. Make sure you're running this script from the project root.\n";
    exit(1);
}

// Read .env file
$envContent = file_get_contents($envFile);

// Check if GEMINI_API_KEY already exists
if (preg_match('/GEMINI_API_KEY=/', $envContent)) {
    // Update existing key
    $envContent = preg_replace('/GEMINI_API_KEY=.*/', "GEMINI_API_KEY={$apiKey}", $envContent);
    echo "Updated existing Gemini API key.\n";
} else {
    // Add new key
    $envContent .= "\n# Gemini AI API Key\nGEMINI_API_KEY={$apiKey}\n";
    echo "Added Gemini API key to .env file.\n";
}

// Write back to .env file
if (file_put_contents($envFile, $envContent)) {
    echo "Success! The Gemini API key has been set.\n";
    echo "Restart your Laravel server for the changes to take effect.\n";
} else {
    echo "Error: Failed to write to .env file. Check file permissions.\n";
    exit(1);
}

echo "\nFollow these steps to get your own Gemini API key:\n";
echo "1. Go to https://ai.google.dev/ and sign in with your Google account\n";
echo "2. Navigate to 'Get API Key' or create a new project\n";
echo "3. Copy your API key and set it using this script\n";
