<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAIController extends Controller
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    protected $useMockResponses = false;

    public function __construct()
    {
        // Get the API key from environment variables
        $this->apiKey = env('GEMINI_API_KEY', '');

        // Enable mock responses only if explicitly set to true in .env
        // or if in local environment with no API key
        $mockMode = env('AI_USE_MOCK_RESPONSES', 'false');
        $this->useMockResponses = ($mockMode === true || $mockMode === 'true') &&
                                 (empty($this->apiKey) || app()->environment('local'));

        // Log the configuration
        Log::info('GeminiAI Configuration', [
            'apiKeyConfigured' => !empty($this->apiKey),
            'mockMode' => $this->useMockResponses,
            'environment' => app()->environment()
        ]);
    }

    /**
     * Generate a response from the AI model
     */
    public function generateResponse(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array',
        ]);

        // Check if we should use mock responses
        if ($this->useMockResponses) {
            return $this->getMockResponse($request->input('message'));
        }

        // Check if API key is available
        if (empty($this->apiKey)) {
            Log::error('Gemini API key not configured');
            return response()->json([
                'error' => 'AI service not properly configured',
                'message' => 'API key is missing'
            ], 500);
        }

        // Debug log the API key (first 5 chars only for security)
        $apiKeyPrefix = substr($this->apiKey, 0, 5);
        Log::debug("Using API key starting with: {$apiKeyPrefix}...");

        try {
            $message = $request->input('message');

            // Updated request format to match the latest Gemini API specifications
            $payload = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            [
                                'text' => $message
                            ]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ],
                'safetySettings' => [
                    [
                        'category' => 'HARM_CATEGORY_HARASSMENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_HATE_SPEECH',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ],
                    [
                        'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                    ]
                ]
            ];

            // Log the request for debugging
            Log::debug('Gemini API request payload: ' . json_encode($payload));

            // Create HTTP client with SSL verification disabled for ALL environments
            $httpClient = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false,  // Disable SSL verification for all environments
                'timeout' => 30,    // Increase timeout to 30 seconds
            ]);

            $apiUrl = $this->baseUrl . '?key=' . $this->apiKey;
            Log::debug('Making request to: ' . str_replace($this->apiKey, '*****', $apiUrl));

            $response = $httpClient->post($apiUrl, $payload);

            // Log the raw response for debugging
            Log::debug('Raw response: ' . $response->body());

            if ($response->successful()) {
                $responseData = $response->json();
                Log::debug('Gemini API response received successfully');

                // Extract text from Gemini response - updated for the current API response format
                $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I couldn\'t generate a response.';

                return response()->json([
                    'response' => $generatedText,
                ]);
            } else {
                $errorBody = $response->body();
                $statusCode = $response->status();
                Log::error("Gemini API error ($statusCode): " . $errorBody);

                // Check if we should try fallback model
                if ($statusCode === 404) {
                    Log::info("Attempting fallback to gemini-pro model");
                    return $this->generateResponseWithFallbackModel($message);
                }

                return response()->json([
                    'error' => 'Failed to get response from AI service',
                    'status' => $statusCode,
                    'details' => json_decode($errorBody, true) ?? $errorBody,
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error in AI generation: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An error occurred while processing your request',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Try with fallback model if primary model fails
     */
    private function generateResponseWithFallbackModel($message)
    {
        try {
            // Fallback to gemini-pro model
            $fallbackUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

            // Create payload
            $payload = [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $message
                            ]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ],
            ];

            // Create HTTP client
            $httpClient = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->withOptions([
                'verify' => false,
                'timeout' => 30,
            ]);

            $apiUrl = $fallbackUrl . '?key=' . $this->apiKey;
            Log::debug('Making fallback request to: ' . str_replace($this->apiKey, '*****', $apiUrl));

            $response = $httpClient->post($apiUrl, $payload);

            if ($response->successful()) {
                $responseData = $response->json();
                $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I couldn\'t generate a response.';

                return response()->json([
                    'response' => $generatedText,
                ]);
            } else {
                $errorBody = $response->body();
                $statusCode = $response->status();
                Log::error("Fallback Gemini API error ($statusCode): " . $errorBody);

                return response()->json([
                    'error' => 'Failed to get response from AI service (fallback also failed)',
                    'status' => $statusCode,
                    'details' => json_decode($errorBody, true) ?? $errorBody,
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error in fallback AI generation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed with both primary and fallback models',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a mock response for local development without API key
     */
    private function getMockResponse($message)
    {
        Log::info('Using mock AI response for message: ' . $message);

        // Convert message to lowercase for simpler matching
        $messageLower = strtolower($message);

        // Define some basic patterns and responses
        $mockResponses = [
            'hello' => 'Hello! How can I help you today?',
            'hi' => 'Hi there! What would you like to learn about?',
            'help' => 'I\'m here to help you learn! Ask me any questions about programming, computer science, or other topics.',
            'thank' => 'You\'re welcome! Feel free to ask if you have more questions.',
            'explain' => $this->generateExplanationResponse($messageLower),
            'what is' => $this->generateExplanationResponse($messageLower),
            'how to' => $this->generateHowToResponse($messageLower),
            'big o' => "Big O notation is used in Computer Science to describe the performance or complexity of an algorithm. It specifically describes the worst-case scenario and can be used to describe the execution time required or the space used by an algorithm.\n\nCommon Big O notations:\n- O(1): Constant time complexity\n- O(log n): Logarithmic time complexity\n- O(n): Linear time complexity\n- O(n log n): Linearithmic time complexity\n- O(n²): Quadratic time complexity\n- O(2^n): Exponential time complexity\n\nFor example, searching an element in a sorted array using binary search has O(log n) time complexity, while searching in an unsorted array has O(n) time complexity.",
        ];

        // Find a matching pattern or return a default response
        foreach ($mockResponses as $pattern => $response) {
            if (strpos($messageLower, $pattern) !== false) {
                // Add a small delay to simulate network request
                usleep(300000); // 300ms delay
                return response()->json([
                    'response' => $response
                ]);
            }
        }

        // Default response if no patterns match
        usleep(300000); // 300ms delay
        return response()->json([
            'response' => "I understand you're asking about \"$message\". As this is running in mock mode, I can only provide basic responses. In a production environment with a proper API key, you would receive a more detailed answer."
        ]);
    }

    /**
     * Generate a mock explanation response
     */
    private function generateExplanationResponse($message)
    {
        if (strpos($message, 'react') !== false) {
            return "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer in web and mobile apps. React allows you to design simple views for each state in your application, and it will efficiently update and render just the right components when your data changes.\n\nKey features of React include:\n- Virtual DOM for performance\n- Component-based architecture\n- JSX syntax\n- Unidirectional data flow\n- Rich ecosystem";
        }

        if (strpos($message, 'php') !== false) {
            return "PHP (Hypertext Preprocessor) is a widely-used open source general-purpose scripting language that is especially suited for web development and can be embedded into HTML.\n\nKey features of PHP include:\n- Server-side scripting\n- Command line scripting\n- Desktop application development\n- Relatively easy to learn\n- Large ecosystem with frameworks like Laravel, Symfony";
        }

        if (strpos($message, 'algorithm') !== false) {
            return "An algorithm is a step-by-step procedure or set of rules designed to perform a specific task or solve a particular problem. In computer science, algorithms are used for data processing, calculation, and automated reasoning.\n\nCharacteristics of a good algorithm include:\n- Correctness: produces the expected output\n- Efficiency: minimizes time and resources\n- Simplicity: easy to understand and implement\n- Scalability: performs well with large input sizes";
        }

        return "I understand you want me to explain something about \"$message\". In mock mode, I can only provide basic explanations. With a proper API key, you would receive a more detailed and accurate explanation.";
    }

    /**
     * Generate a mock how-to response
     */
    private function generateHowToResponse($message)
    {
        if (strpos($message, 'install') !== false) {
            return "To install software, you typically follow these general steps:\n\n1. Check system requirements\n2. Download the software from a trusted source\n3. Run the installer or extract the package\n4. Follow on-screen instructions\n5. Configure settings as needed\n6. Test that the installation works properly\n\nFor specific installation instructions, please refer to the documentation of the software you're trying to install.";
        }

        if (strpos($message, 'code') !== false || strpos($message, 'program') !== false) {
            return "Learning to code involves several steps:\n\n1. Choose a programming language to start with (Python and JavaScript are popular for beginners)\n2. Set up your development environment\n3. Learn the basic syntax and concepts\n4. Practice with small projects\n5. Learn data structures and algorithms\n6. Build larger projects\n7. Learn frameworks and libraries\n8. Join coding communities\n\nConsistency is key - try to code a little bit every day!";
        }

        return "I understand you're asking how to \"$message\". In mock mode, I can only provide basic guidance. With a proper API key, you would receive more detailed step-by-step instructions.";
    }
}
