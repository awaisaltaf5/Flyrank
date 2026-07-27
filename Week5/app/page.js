'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const sidebarRef = useRef(null);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editChatId, setEditChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isNewChat, setIsNewChat] = useState(true);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && currentChatId && !isLoading) {
      const title = (messages[0]?.content?.slice(0, 40) || '') + (messages[0]?.content?.length > 40 ? '...' : '') || 'New Chat';
      setChatHistory(prev => {
        const existing = prev.find(c => c.id === currentChatId);
        if (existing) {
          const updated = prev.map(c => c.id === currentChatId ? { ...c, title, messages: c.messages.length === 0 ? messages : c.messages, lastUpdated: Date.now() } : c);
          localStorage.setItem('chatHistory', JSON.stringify(updated));
          return updated;
        }
        const newChat = { id: currentChatId, title, messages, lastUpdated: Date.now() };
        const updated = [newChat, ...prev];
        localStorage.setItem('chatHistory', JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, currentChatId, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const pos = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(pos < 100);
    setShowJumpButton(pos >= 100);
  };

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      if (!newMode) {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (isAtBottom && !isLoading) scrollToBottom();
  }, [messages, isAtBottom, isLoading]);

  const createNewChat = useCallback(() => {
    if (messages.length > 0 && currentChatId) {
      setChatHistory(prev => {
        const title = (messages[0]?.content?.slice(0, 40) || '') + (messages[0]?.content?.length > 40 ? '...' : '') || 'New Chat';
        const existing = prev.find(c => c.id === currentChatId);
        if (existing) {
          const updated = prev.map(c => c.id === currentChatId ? { ...c, title, messages, lastUpdated: Date.now() } : c);
          localStorage.setItem('chatHistory', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
    setCurrentChatId(Date.now().toString());
    setMessages([]);
    setInput('');
    setIsNewChat(true);
    setShowSidebar(false);
  }, [messages, currentChatId]);

  const loadChat = useCallback((chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setInput('');
    setIsNewChat(false);
    setShowSidebar(false);
    setShowJumpButton(false);
    setIsAtBottom(true);
  }, []);

  const deleteChat = useCallback((e, chatId) => {
    e.stopPropagation();
    const updated = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setInput('');
      setIsNewChat(true);
    }
  }, [chatHistory, currentChatId]);

  const startEditTitle = useCallback((e, chat) => {
    e.stopPropagation();
    setEditChatId(chat.id);
    setEditTitle(chat.title);
  }, []);

  const saveTitle = useCallback((chatId) => {
    if (editTitle.trim()) {
      setChatHistory(prev => {
        const updated = prev.map(c => c.id === chatId ? { ...c, title: editTitle.trim() } : c);
        localStorage.setItem('chatHistory', JSON.stringify(updated));
        return updated;
      });
    }
    setEditChatId(null);
    setEditTitle('');
  }, [editTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const assistantMessage = { role: 'assistant', content: '' };
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    setInput('');
    setShowJumpButton(false);
    setIsAtBottom(true);
    setIsLoading(true);
    setIsNewChat(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.slice(0, -1) }),
      });
      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') lastMessage.content = assistantText;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') lastMessage.content = 'Error: Failed to get response';
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => setIsLoading(false);

  const formatDate = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-text-primary' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-purple/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-all duration-200 backdrop-blur-xl flex items-center justify-center"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* SIDEBAR TOGGLE - Desktop only */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`fixed top-4 left-4 z-50 p-2.5 rounded-xl border transition-all duration-200 backdrop-blur-xl hidden sm:flex items-center justify-center ${
          isDarkMode 
            ? 'bg-slate-800/50 hover:bg-slate-700/50 border-white/5' 
            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
        }`}
        aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg className={`h-5 w-5 ${isDarkMode ? 'text-text-secondary' : 'text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[280px] backdrop-blur-xl border-r transform transition-all duration-300 ease-out z-40 flex flex-col ${
          isDarkMode 
            ? 'bg-slate-900/95 border-white/[0.04]' 
            : 'bg-white/95 border-slate-200'
        } ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-white/[0.04]">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-sm font-bold shadow-glow">
                  AI
                </div>
                <span className={`font-semibold ${isDarkMode ? 'text-text-primary' : 'text-slate-900'}`}>Chats</span>
              </div>
            <button onClick={() => setShowSidebar(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="h-4 w-4 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:from-accent-blue hover:to-accent-purple transition-all shadow-glow">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {chatHistory.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 border ${
                      isDarkMode ? 'bg-white/[0.03] border-white/[0.04]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <svg className={`h-6 w-6 ${isDarkMode ? 'text-text-muted' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-slate-500'}`}>No conversations yet</p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-text-muted opacity-60' : 'text-slate-400'}`}>Start a new chat above</p>
                  </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} onClick={() => loadChat(chat)} onMouseEnter={() => setHoveredChat(chat.id)} onMouseLeave={() => setHoveredChat(null)} className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                currentChatId === chat.id 
                  ? isDarkMode ? 'bg-accent-blue/10 border border-accent-blue/20' : 'bg-blue-50 border border-blue-200' 
                  : isDarkMode ? 'hover:bg-white/[0.03] border border-transparent' : 'hover:bg-slate-50 border border-transparent'
              }`}>
                {editChatId === chat.id ? (
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => saveTitle(chat.id)} onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(chat.id); if (e.key === 'Escape') setEditChatId(null); }} className="w-full bg-white/5 text-text-primary px-2.5 py-1.5 rounded-lg text-sm border border-accent-blue/40 focus:outline-none" autoFocus onClick={(e) => e.stopPropagation()} />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        currentChatId === chat.id 
                          ? 'bg-gradient-to-br from-accent-blue to-accent-purple text-white' 
                          : isDarkMode ? 'bg-white/[0.05] text-text-muted' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {(chat.title || 'N')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-text-primary' : 'text-slate-900'}`}>{chat.title || 'New Chat'}</p>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-text-muted' : 'text-slate-500'}`}>{formatDate(chat.lastUpdated)}</p>
                      </div>
                    </div>
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-all duration-200 ${hoveredChat === chat.id ? 'opacity-100' : 'opacity-0'}`}>
                      <button onClick={(e) => startEditTitle(e, chat)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}>
                        <svg className={`h-3.5 w-3.5 ${isDarkMode ? 'text-text-muted' : 'text-slate-500'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                      </button>
                      <button onClick={(e) => deleteChat(e, chat.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                        <svg className="h-3.5 w-3.5 text-red-400/60" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className={`p-4 border-t ${isDarkMode ? 'border-white/[0.04]' : 'border-slate-200'}`}>
          <p className={`text-xs text-center ${isDarkMode ? 'text-text-muted' : 'text-slate-500'}`}>Made by Muhammad Awais Altaf</p>
        </div>
      </div>

      {/* Sidebar overlay */}
      {showSidebar && <div onClick={() => setShowSidebar(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fade-in" />}

      {/* MAIN CONTENT */}
      <div className={`transition-all duration-300 ease-out ${showSidebar ? 'ml-[280px]' : 'ml-0'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 min-h-screen flex flex-col">
            
            {/* HEADER */}
            <div className="text-center pt-6 pb-2 animate-fade-in-down">
              <div className="flex items-center justify-center gap-3 mb-1">
                {/* Mobile hamburger - inside header for alignment */}
                <button onClick={() => setShowSidebar(!showSidebar)} className={`sm:hidden p-2 rounded-xl border transition-all duration-200 backdrop-blur-xl ${
                  isDarkMode 
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 border-white/5' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                }`} aria-label="Open sidebar">
                  <svg className={`h-5 w-5 ${isDarkMode ? 'text-text-secondary' : 'text-slate-600'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue via-accent-purple to-pink-500 flex items-center justify-center shadow-glow">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm11 2H7a1 1 0 000 2h6a1 1 0 100-2z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent-blue via-accent-purple to-pink-400 bg-clip-text text-transparent">AI Chat</h1>
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 flex flex-col min-h-0 pb-4 animate-fade-in-up">
            <div className="flex-1 relative">
              <div ref={messagesContainerRef} onScroll={handleScroll} className="absolute inset-0 overflow-y-auto px-2 sm:px-4 space-y-3 py-2" role="log" aria-label="Chat messages">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-pink-500/10 border-white/[0.04]' 
                      : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-slate-200'
                  }`}>
                    <svg className={`h-8 w-8 ${isDarkMode ? 'text-accent-blue/60' : 'text-accent-blue'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-text-primary' : 'text-slate-900'}`}>Start a conversation</p>
                  <p className={`text-sm max-w-xs ${isDarkMode ? 'text-text-muted' : 'text-slate-500'}`}>Type a message below and get AI-powered responses</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                      <div className={`max-w-[88%] sm:max-w-[78%] ${message.role === 'user' ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-2xl rounded-br-md px-4 py-2.5 shadow-glow' : 'bg-slate-800/95 text-text-primary rounded-2xl rounded-bl-md px-4 py-2.5 border border-white/[0.04] backdrop-blur-sm'}`}>
                        {message.role === 'assistant' && message.content === '' && isLoading ? (
                          <div className="flex items-center gap-3 py-2 px-1">
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 bg-accent-blue rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-accent-blue rounded-full animate-typing" style={{ animationDelay: '200ms' }} />
                              <div className="w-2 h-2 bg-accent-blue rounded-full animate-typing" style={{ animationDelay: '400ms' }} />
                            </div>
                            <span className="text-sm text-text-secondary">Thinking...</span>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none prose-invert">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {showJumpButton && (
                <button onClick={() => { scrollToBottom(); setShowJumpButton(false); setIsAtBottom(true); }} className="absolute bottom-4 right-6 z-10 px-3 py-2 rounded-xl bg-slate-800/80 backdrop-blur-xl border border-white/[0.06] text-sm text-text-secondary hover:text-white hover:bg-slate-700/80 transition-all duration-200 flex items-center gap-2 animate-fade-in shadow-glow" aria-label="Jump to latest">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Jump to Latest
                </button>
              )}
            </div>

            {/* INPUT */}
            <div className="mt-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl p-2 border border-white/[0.04] focus-within:border-accent-blue/30 transition-all duration-200 shadow-glow">
                <div className="flex-1">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={isLoading} className="w-full px-3 py-2.5 bg-transparent text-text-primary placeholder-text-muted focus:outline-none text-sm" aria-label="Message input" />
                </div>
                {isLoading ? (
                  <button type="button" onClick={handleStop} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-medium hover:from-red-400 hover:to-red-300 transition-all duration-200 shadow-glow flex items-center gap-1.5" aria-label="Stop">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                    Stop
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim()} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:from-accent-blue hover:to-accent-purple disabled:from-slate-700 disabled:to-slate-700 disabled:text-text-muted disabled:cursor-not-allowed transition-all duration-200 shadow-glow flex items-center gap-1.5" aria-label="Send">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Send
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
