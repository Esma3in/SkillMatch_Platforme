<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Diagnostic Tool</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #4a5568;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .status {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 0;
        }
        .status-label {
            font-weight: bold;
            flex: 1;
        }
        .status-value {
            flex: 2;
        }
        .success {
            color: #38a169;
        }
        .warning {
            color: #d69e2e;
        }
        .error {
            color: #e53e3e;
        }
        .test-container {
            margin-top: 20px;
        }
        .test-form {
            display: flex;
            margin-bottom: 15px;
        }
        .test-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            font-size: 16px;
        }
        .test-button {
            padding: 10px 15px;
            background-color: #4299e1;
            color: white;
            border: none;
            border-radius: 4px;
            margin-left: 10px;
            cursor: pointer;
        }
        .test-button:hover {
            background-color: #3182ce;
        }
        .response-container {
            background-color: #f7fafc;
            border-radius: 4px;
            padding: 15px;
            white-space: pre-wrap;
            display: none;
        }
    </style>
</head>
<body>
    <h1>AI Integration Diagnostic Tool</h1>

    <div class="card">
        <h2>Environment Status</h2>

        <div class="status">
            <div class="status-label">Environment:</div>
            <div class="status-value">{{ $appEnv }}</div>
        </div>

        <div class="status">
            <div class="status-label">API Key Status:</div>
            <div class="status-value {{ !str_contains($apiKeyStatus, 'Not') ? 'success' : 'error' }}">
                {{ $apiKeyStatus }}
            </div>
        </div>

        <div class="status">
            <div class="status-label">Mock Mode Status:</div>
            <div class="status-value {{ $mockModeStatus == 'Enabled' ? 'warning' : 'success' }}">
                {{ $mockModeStatus }}
            </div>
        </div>
    </div>

    <div class="card">
        <h2>Test API Connection</h2>

        <div class="test-container">
            <div class="test-form">
                <input type="text" id="test-message" class="test-input" placeholder="Enter a test message..." value="Hello, how are you?">
                <button id="test-button" class="test-button">Test API</button>
            </div>

            <div id="loading" style="display: none;">Testing API connection...</div>
            <div id="response-container" class="response-container"></div>
        </div>
    </div>

    <div class="card">
        <h2>Troubleshooting Steps</h2>

        <p>If you're experiencing issues with the AI integration, try these steps:</p>

        <ol>
            <li>Make sure your API key is correctly set in the .env file</li>
            <li>Run <code>php artisan optimize:clear</code> to clear the cache</li>
            <li>Restart your Laravel server</li>
            <li>Check the Laravel logs at <code>storage/logs/laravel.log</code></li>
            <li>Enable mock mode if you need to test without API access: <code>php enable_mock_mode.php</code></li>
        </ol>
    </div>

    <script>
        document.getElementById('test-button').addEventListener('click', function() {
            const message = document.getElementById('test-message').value;
            const responseContainer = document.getElementById('response-container');
            const loading = document.getElementById('loading');

            if (!message) {
                alert('Please enter a test message');
                return;
            }

            loading.style.display = 'block';
            responseContainer.style.display = 'none';

            fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ message })
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none';
                responseContainer.style.display = 'block';

                if (data.response) {
                    responseContainer.innerHTML = '<strong>Success! Response:</strong>\n\n' + data.response;
                    responseContainer.className = 'response-container success';
                } else if (data.error) {
                    responseContainer.innerHTML = '<strong>Error:</strong>\n\n' + data.error + '\n\n' +
                        (data.message ? data.message : '') + '\n\n' +
                        (data.details ? JSON.stringify(data.details, null, 2) : '');
                    responseContainer.className = 'response-container error';
                }
            })
            .catch(error => {
                loading.style.display = 'none';
                responseContainer.style.display = 'block';
                responseContainer.innerHTML = '<strong>Request Failed:</strong>\n\n' + error;
                responseContainer.className = 'response-container error';
            });
        });
    </script>
</body>
</html>
