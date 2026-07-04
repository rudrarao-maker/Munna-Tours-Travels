'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ArrowRight } from 'lucide-react';
import { popularRoutes } from '@/lib/data';
import Link from 'next/link';

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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate AI thinking & response
    setTimeout(() => {
      generateResponse(userMsg.text);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const generateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: '' };

    // Simple Intent Parsing (Mock AI)
    const matchedRoute = popularRoutes.find(r => 
      lowerInput.includes(r.to.toLowerCase()) || 
      lowerInput.includes(r.from.toLowerCase())
    );

    if (matchedRoute) {
      aiMsg.text = `I have the perfect recommendation for you! Our bus from ${matchedRoute.from} to ${matchedRoute.to} is highly rated. It takes about ${matchedRoute.time} starting at just ${matchedRoute.price} per seat.`;
      aiMsg.isWidget = true;
      aiMsg.routeId = matchedRoute.id;
      
      // Follow up convincing message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          text: `Trust me, this is a premium experience you won't forget. Our ${matchedRoute.type} coaches are incredibly comfortable. Let me know if you want to request a quote!`
        }]);
      }, 1500);

    } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      aiMsg.text = "Hello! I'm here to help you plan your bus journey. Are you looking for a direct route or a custom charter bus for your group?";
    } else if (lowerInput.includes('budget') || lowerInput.includes('cheap')) {
      aiMsg.text = "We have great options for every budget! We have Non-A/C and Semi-Sleeper buses available. Just let me know where you want to go!";
    } else if (lowerInput.includes('charter') || lowerInput.includes('group')) {
      aiMsg.text = "Absolutely! We specialize in custom charter buses for groups. You can head over to our Routes page and fill out the Custom Route form at the bottom.";
    } else {
      aiMsg.text = "That sounds great! To give you the best recommendation, could you tell me your pickup city and destination? (e.g. 'Ahmedabad to Pune')";
    }

    setMessages(prev => [...prev, aiMsg]);
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
            className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.15)] border border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">AI Travel Expert</h3>
                  <p className="text-xs text-white/70 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2 max-w-[75%]">
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-black text-white rounded-tr-sm' 
                        : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {/* Package Widget */}
                    {msg.isWidget && msg.routeId && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-1">
                        {(() => {
                          const r = popularRoutes.find(x => x.id === msg.routeId);
                          if (!r) return null;
                          return (
                            <Link href={`/routes/${r.id}`}>
                              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${r.image}')` }} />
                              <div className="p-4">
                                <h4 className="font-bold text-black text-sm mb-1">{r.from} to {r.to}</h4>
                                <p className="text-xs text-gray-500 font-bold mb-3">{r.time} • {r.price}</p>
                                <div className="text-xs font-black text-black flex items-center group">
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
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1 pl-4 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                <input 
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-black placeholder-gray-400 py-2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
