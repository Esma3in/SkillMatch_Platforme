# Troubleshooting Guide

## SSL Certificate Issues

### Problem: cURL error 60: SSL certificate problem

If you encounter an error like this:

```
cURL error 60: SSL certificate problem: unable to get local issuer certificate
```

This happens because your local PHP environment can't verify the SSL certificate when connecting to external APIs like Google's Gemini API.

### Solutions:

1. **For Development Environments**:
   - Our application automatically disables SSL verification in local/development environments to prevent these errors.
   - Make sure your `.env` file has `APP_ENV=local` or `APP_ENV=development` set.

2. **For Production Environments**:
   - Install proper CA certificates on your server (recommended approach).
   - Download the latest CA certificates bundle from https://curl.se/docs/caextract.html
   - Configure PHP to use this bundle by updating your `php.ini`:
     ```
     curl.cainfo = /path/to/cacert.pem
     ```

3. **Manual Fix (Not recommended for production)**:
   - Edit `config/app.php` to ensure it correctly detects your environment.
   - Or manually install CA certificates on your server.

## API Key Issues

### Problem: "AI service not properly configured" error

If you see a message indicating the AI service is not properly configured:

### Solutions:

1. Make sure you've set up your Gemini API key:
   ```
   php setup_gemini_api.php YOUR_API_KEY_HERE
   ```

2. Verify the API key was added to your `.env` file.

3. Restart your Laravel server after making changes to the `.env` file.

### Using Mock Mode

For development without an API key, we've added a mock mode feature:

1. Add this to your `.env` file:
   ```
   AI_USE_MOCK_RESPONSES=true
   ```

2. With mock mode enabled, the system will return pre-defined responses instead of calling the Gemini API.

3. This is useful for:
   - Development without needing a valid API key
   - Testing the UI without making actual API calls
   - Situations where the API is unavailable or rate-limited

4. Mock mode is automatically enabled in local environments if no Gemini API key is provided.

## Request Timeout Issues

### Problem: Requests to the AI service time out

If requests to the AI service are timing out:

### Solutions:

1. Check your internet connection.

2. Verify that the Gemini API is operational by visiting their status page.

3. Consider increasing your timeout settings in the application.

4. Switch to mock mode temporarily if you need to work while the API is down.

## Other Common Issues

### Front-end not showing messages

If you send a message but it doesn't appear in the chat:

1. Check the browser console for JavaScript errors.

2. Ensure you have the latest front-end code by rebuilding your assets:
   ```
   npm run build
   ```

3. Clear your browser cache and reload the page.

### Backend server errors

If you're seeing 500 Internal Server Error responses:

1. Check your Laravel logs at `storage/logs/laravel.log`.

2. Ensure your server has the required PHP extensions:
   - curl
   - json
   - openssl

3. Verify that your server can make outbound HTTPS connections to external APIs.

## Getting Help

If you continue experiencing issues:

1. Check if similar issues have been reported in the project's issue tracker.

2. Provide detailed error logs when seeking help.

3. Contact the project maintainers with specific details about your environment and the exact errors you're encountering. 
