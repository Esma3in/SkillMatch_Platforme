/**
 * Chat History Management Utilities
 * 
 * This file contains utilities for managing chat history in localStorage
 */

const CHAT_HISTORY_KEY = 'skillmatch_chat_history';
const ACTIVE_CHAT_KEY = 'skillmatch_active_chat';

/**
 * Get all saved chat sessions
 * @returns {Array} Array of chat session objects
 */
export const getChatSessions = () => {
  try {
    const sessions = localStorage.getItem(CHAT_HISTORY_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    return [];
  }
};

/**
 * Get a specific chat session by ID
 * @param {string} sessionId The ID of the chat session to retrieve
 * @returns {Object|null} The chat session object or null if not found
 */
export const getChatSessionById = (sessionId) => {
  const sessions = getChatSessions();
  return sessions.find(session => session.id === sessionId) || null;
};

/**
 * Save a new chat session
 * @param {Object} session The chat session to save
 * @returns {string} The ID of the saved session
 */
export const saveChatSession = (session) => {
  try {
    const sessions = getChatSessions();
    
    // Check if session already exists (for updating)
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      // Update existing session
      sessions[existingIndex] = {
        ...sessions[existingIndex],
        ...session,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new session with ID if not provided
      const newSession = {
        id: session.id || Date.now().toString(),
        title: session.title || generateSessionTitle(session),
        messages: session.messages || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sessions.push(newSession);
      session = newSession;
    }
    
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
    return session.id;
  } catch (error) {
    console.error('Error saving chat session:', error);
    return null;
  }
};

/**
 * Delete a chat session by ID
 * @param {string} sessionId The ID of the chat session to delete
 * @returns {boolean} True if successful, false otherwise
 */
export const deleteChatSession = (sessionId) => {
  try {
    const sessions = getChatSessions();
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(filteredSessions));
    
    // If we deleted the active session, clear that too
    const activeSession = getActiveSession();
    if (activeSession?.id === sessionId) {
      clearActiveSession();
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return false;
  }
};

/**
 * Rename a chat session
 * @param {string} sessionId The ID of the chat session to rename
 * @param {string} newTitle The new title for the chat session
 * @returns {boolean} True if successful, false otherwise
 */
export const renameChatSession = (sessionId, newTitle) => {
  try {
    const sessions = getChatSessions();
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].title = newTitle;
      sessions[sessionIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error renaming chat session:', error);
    return false;
  }
};

/**
 * Set the active chat session
 * @param {string} sessionId The ID of the active chat session
 */
export const setActiveSession = (sessionId) => {
  localStorage.setItem(ACTIVE_CHAT_KEY, sessionId);
};

/**
 * Get the active chat session
 * @returns {Object|null} The active chat session or null if none is set
 */
export const getActiveSession = () => {
  const activeSessionId = localStorage.getItem(ACTIVE_CHAT_KEY);
  return activeSessionId ? getChatSessionById(activeSessionId) : null;
};

/**
 * Clear the active chat session
 */
export const clearActiveSession = () => {
  localStorage.removeItem(ACTIVE_CHAT_KEY);
};

/**
 * Update messages in a chat session
 * @param {string} sessionId The ID of the chat session to update
 * @param {Array} messages The new messages array
 * @returns {boolean} True if successful, false otherwise
 */
export const updateChatMessages = (sessionId, messages) => {
  try {
    const sessions = getChatSessions();
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].messages = messages;
      sessions[sessionIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating chat messages:', error);
    return false;
  }
};

/**
 * Generate a title for a chat session based on its first few messages
 * @param {Object} session The chat session
 * @returns {string} A generated title
 */
const generateSessionTitle = (session) => {
  if (!session.messages || session.messages.length === 0) {
    return 'New Chat';
  }
  
  // Try to find the first user message
  const firstUserMessage = session.messages.find(msg => msg.role === 'user');
  
  if (firstUserMessage) {
    // Truncate the message if it's too long
    const messageText = firstUserMessage.content;
    const title = messageText.length > 30 
      ? messageText.substring(0, 30) + '...' 
      : messageText;
    return title;
  }
  
  return 'New Chat';
};

/**
 * Clear all chat history
 * @returns {boolean} True if successful, false otherwise
 */
export const clearAllChatHistory = () => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
}; 