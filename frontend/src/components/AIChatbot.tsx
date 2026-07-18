'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ArrowRight } from 'lucide-react';
import { popularRoutes } from '@/lib/data';
import Link from 'next/link';
import axios from '@/lib/axios';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isWidget?: boolean;
  routeId?: string;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hi there! I am Munna, your personal AI travel expert. Where are you planning to travel today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState('');

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    setSessionId(`session-${Math.random().toString(36).substring(2, 10)}`);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input.trim();
    setInput('');
    
    try {
      const res = await axios.post('/ai/chat', {
        message: userInput,
        sessionId
      });
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: res.data.reply || res.data.message
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] z-50 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.15)] flex flex-col z-50 overflow-hidden"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-center" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', opacity: 0.9 }}>
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white dark:text-black">AI Travel Expert</h3>
                  <p className="text-xs font-medium flex items-center gap-1 text-white/70 dark:text-black/70">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity text-white dark:text-black">
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ backgroundColor: 'var(--background)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                      <Bot size={16} />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'rounded-tr-sm' 
                        : 'rounded-tl-sm shadow-sm'
                    }`}
                    style={msg.sender === 'user' ? { backgroundColor: 'var(--foreground)', color: 'var(--background)' } : { backgroundColor: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}
                    >
                      {msg.text}
                    </div>
                    
                    {/* Package Widget */}
                    {msg.isWidget && msg.routeId && (
                      <div className="rounded-xl shadow-sm overflow-hidden mt-1" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                        {(() => {
                          const r = popularRoutes.find(x => x.id === msg.routeId);
                          if (!r) return null;
                          return (
                            <Link href={`/routes/${r.id}`}>
                              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${r.image}')` }} />
                              <div className="p-4">
                                <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{r.from} to {r.to}</h4>
                                <p className="text-xs font-bold mb-3" style={{ color: 'var(--muted)' }}>{r.time} • {r.price}</p>
                                <div className="text-xs font-black flex items-center group" style={{ color: 'var(--foreground)' }}>
                                  Request Quote <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </Link>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
              <div className="flex items-center rounded-full p-1 pl-4 focus-within:ring-1 transition-all"
                   style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                <input 
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium py-2"
                  style={{ color: 'var(--foreground)' }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                >
                  <Send size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
