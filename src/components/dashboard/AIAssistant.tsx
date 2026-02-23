import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, ChevronDown, Leaf, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Smart AI logic
const generateMockResponse = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerQuery = query.toLowerCase();

            if (lowerQuery.includes('tomato') && lowerQuery.includes('yellow')) {
                resolve("Yellowing tomato leaves often indicate a nitrogen deficiency or early blight. I recommend applying a balanced, nitrogen-rich fertilizer. Check the lower leaves for dark concentric spots, which would confirm blight.");
            } else if (lowerQuery.includes('water') && lowerQuery.includes('wheat')) {
                resolve("Wheat requires about 12-15 inches of water throughout its growing season. During the crucial heading and flowering stages, ensure the soil moisture doesn't drop below 50% of its water-holding capacity.");
            } else if (lowerQuery.includes('pest') || lowerQuery.includes('bug')) {
                resolve("For general pest control, an integrated pest management (IPM) approach is best. Consider introducing beneficial insects like ladybugs, or applying neem oil as a first organic defense line before opting for chemical pesticides.");
            } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
                resolve("Hello! I'm your Agridom AI Assistant. How can I help you optimize your crop yields or identify farming issues today?");
            } else {
                resolve("That's an interesting question about agricultural management. While I don't have real-time data on that specific query right now, I'd suggest checking the 'Detailed Statistics' tab for historical correlations or consulting your local agricultural extension office.");
            }
        }, 1200 + Math.random() * 800); // Simulate network latency (1.2s - 2s)
    });
};

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export const AIAssistant: React.FC = () => {
    const { settings } = useAppSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hi! I'm your AgriDom Assistant. Ask me anything about crop diseases, watering schedules, or farm management.",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: trimmedInput,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        const aiResponseText = await generateMockResponse(trimmedInput);

        const newAiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
            timestamp: new Date()
        };

        setIsTyping(false);
        setMessages(prev => [...prev, newAiMessage]);
    };

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors border-4 border-white/20 dark:border-slate-800/50"
                    >
                        <Bot size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col border transition-colors duration-300 ${settings.darkMode
                                ? 'bg-slate-900 border-slate-700/50 shadow-emerald-900/10'
                                : 'bg-white border-emerald-100 shadow-emerald-600/10'
                            }`}
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className={`p-4 flex items-center justify-between border-b transition-colors ${settings.darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-600 border-emerald-700 text-white'
                            }`}>
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${settings.darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/20 text-white'}`}>
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${settings.darkMode ? 'text-slate-100' : 'text-white'}`}>Agridom AI</h3>
                                    <p className={`text-xs flex items-center ${settings.darkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>
                                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className={`hover:bg-black/10 rounded-full ${settings.darkMode ? 'text-slate-400 hover:text-white' : 'text-white hover:text-white'}`}
                            >
                                <ChevronDown size={20} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            className={`flex-1 p-4 overflow-y-auto space-y-4 ${settings.darkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}
                            ref={scrollRef}
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex items-end space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>

                                        {/* Avatar */}
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user'
                                                ? (settings.darkMode ? 'bg-indigo-600' : 'bg-indigo-100 text-indigo-700')
                                                : (settings.darkMode ? 'bg-emerald-900 border border-emerald-700' : 'bg-emerald-100 text-emerald-700')
                                            }`}>
                                            {msg.sender === 'user' ? <User size={14} className={settings.darkMode ? 'text-white' : ''} /> : <Leaf size={14} className={settings.darkMode ? 'text-emerald-400' : ''} />}
                                        </div>

                                        {/* Bubble */}
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm'
                                                : (settings.darkMode ? 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700' : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100 shadow-sm')
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] mt-1 px-10 ${settings.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start">
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 ${settings.darkMode ? 'bg-emerald-900 border border-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        <Leaf size={14} className={settings.darkMode ? 'text-emerald-400' : ''} />
                                    </div>
                                    <div className={`p-3 rounded-2xl rounded-bl-sm flex space-x-1.5 items-center ${settings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <motion.div className={`w-1.5 h-1.5 rounded-full ${settings.darkMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                        <motion.div className={`w-1.5 h-1.5 rounded-full ${settings.darkMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                        <motion.div className={`w-1.5 h-1.5 rounded-full ${settings.darkMode ? 'bg-emerald-500' : 'bg-emerald-400'}`} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className={`p-3 border-t transition-colors ${settings.darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-emerald-50'}`}>
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about crops, pests..."
                                    className={`flex-1 rounded-full border-0 focus-visible:ring-1 focus-visible:ring-emerald-500 ${settings.darkMode ? 'bg-slate-900 text-white placeholder:text-slate-500' : 'bg-slate-100'}`}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="rounded-full shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <Send size={16} className="text-white ml-0.5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
