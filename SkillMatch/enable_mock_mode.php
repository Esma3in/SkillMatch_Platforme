<?php
/**
 * AI Mock Mode Setup Script
 *
 * This script enables mock mode for the AI chat feature in your .env file.
 * Mock mode provides pre-defined responses without needing a valid Gemini API key.
 *
 * Usage:
 * php enable_mock_mode.php
 */

// Path to .env file
$envFile = __DIR__ . '/.env';

if (!file_exists($envFile)) {
    echo "Error: .env file not found. Make sure you're running this script from the project root.\n";
    exit(1);
}

// Read .env file
$envContent = file_get_contents($envFile);

// Check if AI_USE_MOCK_RESPONSES already exists
if (preg_match('/AI_USE_MOCK_RESPONSES=/', $envContent)) {
    // Update existing setting
    $envContent = preg_replace('/AI_USE_MOCK_RESPONSES=.*/', "AI_USE_MOCK_RESPONSES=true", $envContent);
    echo "Updated AI_USE_MOCK_RESPONSES to true.\n";
} else {
    // Add new setting
    $envContent .= "\n# AI Mock Mode\nAI_USE_MOCK_RESPONSES=true\n";
    echo "Added AI_USE_MOCK_RESPONSES=true to .env file.\n";
}

// Write back to .env file
if (file_put_contents($envFile, $envContent)) {
    echo "Success! AI mock mode has been enabled.\n";
    echo "Restart your Laravel server for the changes to take effect.\n";
} else {
    echo "Error: Failed to write to .env file. Check file permissions.\n";
    exit(1);
}

echo "\nMock mode will provide pre-defined responses to chat messages without calling the Gemini API.\n";
echo "This is useful for development and testing when you don't have a valid API key.\n";
echo "To disable mock mode, set AI_USE_MOCK_RESPONSES=false in your .env file.\n";
