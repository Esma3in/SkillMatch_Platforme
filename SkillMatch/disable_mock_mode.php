<?php
/**
 * AI Mock Mode Disable Script
 *
 * This script disables mock mode for the AI chat feature in your .env file.
 *
 * Usage:
 * php disable_mock_mode.php
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
    $envContent = preg_replace('/AI_USE_MOCK_RESPONSES=.*/', "AI_USE_MOCK_RESPONSES=false", $envContent);
    echo "Updated AI_USE_MOCK_RESPONSES to false.\n";
} else {
    // Add new setting
    $envContent .= "\n# AI Mock Mode\nAI_USE_MOCK_RESPONSES=false\n";
    echo "Added AI_USE_MOCK_RESPONSES=false to .env file.\n";
}

// Write back to .env file
if (file_put_contents($envFile, $envContent)) {
    echo "Success! AI mock mode has been disabled.\n";
    echo "Restart your Laravel server for the changes to take effect.\n";
} else {
    echo "Error: Failed to write to .env file. Check file permissions.\n";
    exit(1);
}

echo "\nThe system will now use the real Gemini API for all chat responses.\n";
echo "If you want to re-enable mock mode, run the enable_mock_mode.php script.\n";
