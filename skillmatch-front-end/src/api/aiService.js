import { api } from './api';

export const aiService = {
  sendMessage: async (message, history) => {
    try {
      const response = await api.post('/api/ai/chat', {
        message,
        history,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to AI service:', error);
      
      // Extract error information for better error handling
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to connect to AI service';
      
      // Throw a more informative error
      const enhancedError = new Error(errorMessage);
      enhancedError.details = error.response?.data?.details || {};
      enhancedError.status = error.response?.status || 500;
      throw enhancedError;
    }
  }
}; 