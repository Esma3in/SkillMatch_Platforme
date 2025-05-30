import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import NavbarCandidate from '../components/common/navbarCandidate';
import { aiService } from '../api/aiService';
import { parseMarkdown } from '../utils/markdownParser';
import { 
  getChatSessions, 
  saveChatSession, 
  deleteChatSession, 
  renameChatSession,
  setActiveSession,
  getActiveSession,
  clearActiveSession,
  updateChatMessages
} from '../utils/chatHistoryUtils';
import '../styles/pages/StudyWithAI.css';

// Import icons from react-icons
import { 
  IoSend, 
  IoTrash, 
  IoRefresh, 
  IoEllipsisVertical,
  IoAddCircleOutline,
  IoCloseCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoPencil,
  IoMenu,
  IoCloseOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';

// Function to format code blocks in AI responses
const formatMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return <p>Error displaying message</p>;
  }

  // Check if message contains code blocks (```code```)
  if (!message.includes('```')) {
    return <p>{message}</p>;
  }

  // Split by code blocks
  const parts = [];
  let lastIndex = 0;
  let language = '';
  
  // Find all code blocks
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  
  try {
    while ((match = regex.exec(message)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(<p key={`text-${lastIndex}`}>{message.substring(lastIndex, match.index)}</p>);
      }
      
      // Add code block
      language = match[1] || 'javascript';
      parts.push(
        <pre key={`code-${match.index}`}>
          <code className={`language-${language}`}>
            {match[2]}
          </code>
        </pre>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < message.length) {
      parts.push(<p key={`text-${lastIndex}`}>{message.substring(lastIndex)}</p>);
    }
    
    return <>{parts}</>;
  } catch (error) {
    console.error('Error formatting message:', error);
    return <p>{message}</p>;
  }
};

// Get formatted time for message timestamps
const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Fallback responses for when the API fails
const fallbackResponses = [
  "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
  "It seems there's a technical issue. Could you try asking again?",
  "I apologize, but I can't respond properly right now due to a connection problem. Please try again shortly.",
  "Sorry for the inconvenience. There's a temporary issue with my response system."
];

const getRandomFallbackResponse = () => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

const StudyWithAI = () => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Session management
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  
  // UI state
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const titleInputRef = useRef(null);

  // Suggestions for new chats
  const suggestions = [
    "Explain Big O notation",
    "Help me understand React hooks",
    "What's the difference between SQL and NoSQL?",
    "Explain object-oriented programming",
    "How to implement binary search?",
    "What are design patterns in software engineering?",
  ];

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const loadedSessions = getChatSessions();
    setSessions(loadedSessions);
    
    // Get active session or create a new one
    const activeSession = getActiveSession();
    if (activeSession) {
      setCurrentSession(activeSession);
      setMessages(activeSession.messages || []);
      setSessionTitle(activeSession.title || 'New Chat');
    } else {
      createNewSession();
    }
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle window resize
  const handleResize = () => {
    setShowSidebar(window.innerWidth > 768);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus on title input when editing
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Create a new chat session
  const createNewSession = () => {
    const welcomeMessage = {
      id: 'welcome',
      content: "Hello! I'm your AI study assistant. How can I help you today?",
      role: 'assistant',
      time: getFormattedTime(),
    };
    
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [welcomeMessage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveChatSession(newSession);
    setActiveSession(newSession.id);
    setCurrentSession(newSession);
    setMessages([welcomeMessage]);
    setSessionTitle('New Chat');
    setSessions(getChatSessions());
    
    // Focus on input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Switch to a different chat session
  const switchSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session.id);
      setCurrentSession(session);
      setMessages(session.messages || []);
      setSessionTitle(session.title || 'New Chat');
      setIsEditingTitle(false);
      
      // Hide sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        setShowSidebar(false);
      }
    }
  };

  // Delete a chat session
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    
    // Show confirmation modal
    setModalContent({
      title: 'Delete Chat',
      message: 'Are you sure you want to delete this chat? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        deleteChatSession(sessionId);
        
        // If we're deleting the current session, create a new one
        if (currentSession?.id === sessionId) {
          createNewSession();
        }
        
        setSessions(getChatSessions());
        setIsModalOpen(false);
      }
    });
    
    setIsModalOpen(true);
  };

  // Handle session title change
  const handleTitleChange = (e) => {
    setSessionTitle(e.target.value);
  };

  // Save edited title
  const saveTitle = () => {
    if (currentSession) {
      const trimmedTitle = sessionTitle.trim();
      const newTitle = trimmedTitle || 'New Chat';
      
      renameChatSession(currentSession.id, newTitle);
      setSessions(getChatSessions());
      setSessionTitle(newTitle);
    }
    
    setIsEditingTitle(false);
  };

  // Handle title input keydown
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setSessionTitle(currentSession?.title || 'New Chat');
    }
  };

  // Send a message to the AI
  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      time: getFormattedTime(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    // Update session with the new message
    if (currentSession) {
      currentSession.messages = updatedMessages;
      updateChatMessages(currentSession.id, updatedMessages);
      setSessions(getChatSessions());
    }
    
    try {
      // Format conversation history for the API - only send the last 5 messages to avoid overloading
      const recentMessages = updatedMessages.slice(-5).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content
      }));
      
      // Send message to backend
      const response = await aiService.sendMessage(messageText, recentMessages);
      
      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        time: getFormattedTime(),
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setApiKeyMissing(false);
      
      // Update session with the AI response
      if (currentSession) {
        currentSession.messages = finalMessages;
        updateChatMessages(currentSession.id, finalMessages);
        
        // If this is a new chat (only 1 message before), update the title
        if (updatedMessages.length === 1 || (updatedMessages.length === 2 && updatedMessages[0].role === 'assistant')) {
          const newTitle = messageText.length > 30 
            ? messageText.substring(0, 30) + '...' 
            : messageText;
          
          renameChatSession(currentSession.id, newTitle);
          setSessionTitle(newTitle);
        }
        
        setSessions(getChatSessions());
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Check if API key is missing
      if (error.message.includes('API key is missing') || error.message.includes('not properly configured')) {
        toast.error('AI service not properly configured. Please contact an administrator.');
        setApiKeyMissing(true);
      } else {
        toast.error(error.message || 'Failed to get a response. Please try again.');
      }
      
      // Add error message as AI response
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: getRandomFallbackResponse(),
        role: 'assistant',
        time: getFormattedTime(),
        isError: true
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Update session with the error message
      if (currentSession) {
        currentSession.messages = finalMessages;
        updateChatMessages(currentSession.id, finalMessages);
        setSessions(getChatSessions());
      }
    } finally {
      setIsLoading(false);
      
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Regenerate the last AI response
  const handleRegenerateResponse = () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === 'user');
    
    if (lastUserMessageIndex >= 0) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      
      // Remove the last AI message(s)
      const newMessages = messages.slice(0, messages.length - lastUserMessageIndex);
      setMessages(newMessages);
      
      // Re-send the last user message
      handleSendMessage(lastUserMessage.content);
    }
  };

  // Handle input keydown (for Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear all messages in the current chat
  const handleClearChat = () => {
    // Show confirmation modal
    setModalContent({
      title: 'Clear Chat',
      message: 'Are you sure you want to clear all messages in this chat?',
      confirmLabel: 'Clear',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        const welcomeMessage = {
          id: 'welcome',
          content: "Hello! I'm your AI study assistant. How can I help you today?",
          role: 'assistant',
          time: getFormattedTime(),
        };
        
        setMessages([welcomeMessage]);
        
        if (currentSession) {
          currentSession.messages = [welcomeMessage];
          updateChatMessages(currentSession.id, [welcomeMessage]);
          setSessions(getChatSessions());
        }
        
        setIsModalOpen(false);
      }
    });
    
    setIsModalOpen(true);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Render the confirmation modal
  const renderModal = () => {
    if (!isModalOpen || !modalContent) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>{modalContent.title}</h3>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div className="modal-body">
            <p>{modalContent.message}</p>
          </div>
          <div className="modal-footer">
            <button className="modal-cancel" onClick={() => setIsModalOpen(false)}>
              {modalContent.cancelLabel || 'Cancel'}
            </button>
            <button className="modal-confirm" onClick={modalContent.onConfirm}>
              {modalContent.confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavbarCandidate />
      <div className="ai-chat-layout">
        {/* Sidebar with chat history */}
        <div className={`chat-sidebar ${showSidebar ? 'show' : 'hide'}`}>
          <div className="sidebar-header">
            <button className="new-chat-button" onClick={createNewSession}>
              <IoAddCircleOutline size={20} />
              <span>New Chat</span>
            </button>
            <button className="close-sidebar-button" onClick={toggleSidebar}>
              <IoCloseOutline size={24} />
            </button>
          </div>
          
          <div className="chat-sessions">
            {sessions.length === 0 ? (
              <div className="no-sessions">No chat history yet</div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id} 
                  className={`chat-session ${currentSession?.id === session.id ? 'active' : ''}`}
                  onClick={() => switchSession(session.id)}
                >
                  <div className="session-title">
                    {session.title || 'New Chat'}
                  </div>
                  <div className="session-actions">
                    <button 
                      className="delete-session-button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      title="Delete chat"
                    >
                      <IoTrash size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Main chat interface */}
        <div className="chat-main">
          <div className="chat-header">
            <button className="toggle-sidebar-button" onClick={toggleSidebar}>
              <IoMenu size={24} />
            </button>
            
            {isEditingTitle ? (
              <div className="chat-title-edit">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={sessionTitle}
                  onChange={handleTitleChange}
                  onBlur={saveTitle}
                  onKeyDown={handleTitleKeyDown}
                  maxLength={50}
                  className="title-input"
                />
              </div>
            ) : (
              <div className="chat-title" onClick={() => setIsEditingTitle(true)}>
                <h1>{sessionTitle || 'New Chat'}</h1>
                <button className="edit-title-button" title="Edit title">
                  <IoPencil size={16} />
                </button>
              </div>
            )}
            
            <div className="chat-actions">
              <button 
                className="clear-chat-button" 
                onClick={handleClearChat}
                title="Clear chat"
              >
                <IoTrash size={20} />
              </button>
            </div>
          </div>
          
          {apiKeyMissing && (
            <div className="api-key-warning">
              <IoInformationCircleOutline size={20} />
              <span>AI service not properly configured. Please contact an administrator.</span>
            </div>
          )}
          
          <div className="chat-container" ref={chatContainerRef}>
            {/* Welcome message and suggestions for new chats */}
            {messages.length === 0 && (
              <div className="welcome-container">
                <h2>Study with AI Assistant</h2>
                <p>
                  Ask questions about programming, computer science, or any study topic
                  to get instant help and explanations.
                </p>
                
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-chip"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat messages */}
            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message message-${message.role === 'assistant' ? 'ai' : 'user'} ${message.isError ? 'message-error' : ''}`}
                >
                  <div className="message-content">
                    {message.role === 'assistant' ? (
                      <div className="ai-avatar">AI</div>
                    ) : (
                      <div className="user-avatar">YOU</div>
                    )}
                    
                    <div className="message-body">
                      <div className="message-text">
                        {parseMarkdown(message.content)}
                      </div>
                      <div className="message-footer">
                        <div className="message-time">{message.time}</div>
                        
                        {message.role === 'assistant' && !message.isError && (
                          <div className="message-actions">
                            <button 
                              className="regenerate-button"
                              onClick={handleRegenerateResponse}
                              title="Regenerate response"
                            >
                              <IoRefresh size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator when loading */}
              {isLoading && (
                <div className="message message-ai">
                  <div className="message-content">
                    <div className="ai-avatar">AI</div>
                    <div className="message-body">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat input */}
          <div className="chat-input-container">
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                disabled={isLoading}
                rows={1}
                // Auto-resize the textarea
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                }}
              />
              <button
                className="send-button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
              >
                <IoSend size={20} />
              </button>
            </div>
            <div className="input-info">
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation modal */}
      {renderModal()}
    </>
  );
};

export default StudyWithAI; 