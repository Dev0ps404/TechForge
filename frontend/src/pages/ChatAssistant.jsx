import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Sparkles, User, Loader2, ArrowRight } from 'lucide-react';

const ChatAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I am your TalentForge Career & Tech Interview Mentor. 
How can I help you prepare today? You can ask me to review a concept, optimize a resume project, list common MERN questions, or explain system design trade-offs.`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const promptSuggestions = [
    'Placement guidance for MERN stack',
    'Explain BFS vs DFS in detail',
    'Resume suggestions for a junior developer',
    'Common System Design topics for scaling APIs',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) {
      setInputValue('');
    }

    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);

    try {
      setSending(true);

      // Call Chat API
      const res = await api.post('/chat', {
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.data.message },
        ]);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered a network error. Please verify your OpenAI key is configured on the server.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // Simple text renderer that handles newlines and basic list marks
  const renderMessageContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc my-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-sm text-indigo-500 mt-2 mb-1">
            {line.substring(4)}
          </h4>
        );
      }
      return (
        <p key={idx} className="my-1.5 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto border rounded-3xl glass-panel overflow-hidden">
      {/* Advisor Header */}
      <div className="px-6 py-4 border-b flex items-center gap-3 bg-indigo-500/5">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-sm">TalentForge Career Mentor</h3>
          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> AI Assistant Online
          </span>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-4 bg-white/20 dark:bg-dark-900/10">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${
                isAssistant ? 'self-start' : 'self-end flex-row-reverse ml-auto'
              }`}
            >
              {/* Profile Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isAssistant
                    ? 'bg-indigo-500/15 text-indigo-500'
                    : 'bg-slate-200 dark:bg-dark-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isAssistant ? 'TF' : <User className="w-4 h-4" />}
              </div>

              {/* Message box */}
              <div
                className={`p-4 rounded-2xl border text-xs font-light shadow-sm ${
                  isAssistant
                    ? 'bg-white dark:bg-dark-900 border-slate-100 dark:border-dark-850 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    : 'bg-indigo-650 border-indigo-700 text-white rounded-tr-none shadow-indigo-500/5'
                }`}
              >
                {renderMessageContent(msg.content)}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center text-xs font-bold">
              TF
            </div>
            <div className="p-4 rounded-2xl border bg-white dark:bg-dark-900 border-slate-100 dark:border-dark-850 rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t bg-slate-50/50 dark:bg-dark-950/20 flex flex-wrap gap-2">
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-dark-850 hover:border-indigo-500/40 hover:bg-indigo-50/10 transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Panel */}
      <div className="p-4 border-t flex items-center gap-2 bg-slate-50 dark:bg-dark-950/30">
        <input
          type="text"
          placeholder="Ask a career guidance question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 text-xs transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !inputValue.trim()}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shadow-indigo-650/15"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
