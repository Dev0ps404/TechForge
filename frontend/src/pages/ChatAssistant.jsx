import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const renderMessageContent = (content) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc my-1 text-xs font-light">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-xs text-indigo-500 dark:text-indigo-400 mt-3 mb-1.5 uppercase tracking-wider">
            {line.substring(4)}
          </h4>
        );
      }
      return (
        <p key={idx} className="my-1.5 leading-relaxed text-xs font-light">
          {line}
        </p>
      );
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto border border-slate-200/60 dark:border-white/5 bg-white dark:bg-card-dark rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Advisor Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3 bg-slate-50/50 dark:bg-bg-dark/15">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-550 flex-shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse-smooth text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-150">Career Mentor</h3>
          <span className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold tracking-wider uppercase mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> AI Mentor Online
          </span>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-4 bg-slate-50/20 dark:bg-bg-dark/5">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${
                  isAssistant ? 'self-start' : 'self-end flex-row-reverse ml-auto'
                }`}
              >
                {/* Profile Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold border ${
                    isAssistant
                      ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/15'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-650 dark:text-slate-350 border-slate-200/50 dark:border-white/10'
                  }`}
                >
                  {isAssistant ? 'TF' : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message box */}
                <div
                  className={`p-4 rounded-xl border text-xs shadow-[0_2px_10px_rgba(0,0,0,0.01)] ${
                    isAssistant
                      ? 'bg-white dark:bg-bg-dark-sec/60 border-slate-200/60 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-3 max-w-[80%] self-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-bold border border-indigo-500/15">
              TF
            </div>
            <div className="p-4 rounded-xl border bg-white dark:bg-bg-dark-sec/60 border-slate-250 dark:border-white/5 rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="font-light text-[11px]">Analyzing prompt...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompt Chips */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-bg-dark/10 flex flex-wrap gap-2">
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Message Input Panel */}
      <div className="p-4 border-t border-slate-150 dark:border-white/5 flex items-center gap-2 bg-slate-50/50 dark:bg-bg-dark/15">
        <input
          type="text"
          placeholder="Ask a career guidance question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-xs transition-all font-medium placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !inputValue.trim()}
          className="p-3 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-500/15 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatAssistant;
