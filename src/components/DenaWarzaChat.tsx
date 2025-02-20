import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, XCircle, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { processMessage } from './utils/processMessage';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    id: string;
}

interface ChatResponse {
    choices: {
        message: {
            content: string;
            role: string;
        };
    }[];
}

const generateMessageId = () => `msg_${Math.random().toString(36).substr(2, 9)}`;

const systemContext = `
You are Dena-Warza, an AI assistant with specific knowledge about Najmita Zahira Dirgantoro and Defano Arya Wardhana. 
You communicate primarily in Bahasa Indonesia, mixed with English when appropriate. 
When asked about Najmita or Defano, use the provided personal information to give accurate responses.
If you don't have specific information about what's being asked, politely ask for clarification.
Key characteristics:
- Friendly and professional tone
- Uses emoticons occasionally 😊
- Prefers Bahasa Indonesia but comfortable with English
- Deep knowledge about tech and design topics
- Always maintains respectful boundaries
`;

const DenaWarzaChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFirstMessage, setIsFirstMessage] = useState(true);
    const [typingIndicator, setTypingIndicator] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    const SITE_URL = import.meta.env.VITE_SITE_URL;
    const SITE_NAME = import.meta.env.VITE_SITE_NAME;

    // Enhanced stream text effect with variable speed
    const streamText = async (text: string, callback: (streamedText: string) => void) => {
        const words = text.split(' ');
        let currentText = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            currentText += word + ' ';
            callback(currentText);

            // Variable delay based on punctuation and position
            const delay = word.endsWith('.') || word.endsWith('?') || word.endsWith('!')
                ? 150
                : word.endsWith(',') || word.endsWith(';')
                    ? 100
                    : Math.random() * 30 + 30; // Random delay between 30-60ms for natural typing feel

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    // Focus input field after message sent
    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    // Welcome message with delayed appearance
    useEffect(() => {
        if (isFirstMessage) {
            setTimeout(() => {
                setTypingIndicator(true);

                setTimeout(() => {
                    setTypingIndicator(false);
                    const welcomeMessage: Message = {
                        role: 'assistant',
                        content: "Halo! Saya Dena-Warza, asisten AI untuk Najmita dan Defano. Ada yang bisa saya bantu hari ini? 💙",
                        timestamp: new Date(),
                        id: generateMessageId()
                    };
                    setMessages([welcomeMessage]);
                    setIsFirstMessage(false);
                }, 1500);
            }, 500);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
            id: generateMessageId()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setError(null);
        setIsLoading(true);

        // Show typing indicator before response appears
        setTimeout(() => setTypingIndicator(true), 300);

        try {
            // Process the message locally first
            let localResponse = processMessage(input.trim());

            // If the local response is different from the input, use it
            if (localResponse !== input.trim()) {
                setTimeout(() => {
                    setTypingIndicator(false);
                    const assistantMessage: Message = {
                        role: 'assistant',
                        content: localResponse,
                        timestamp: new Date(),
                        id: generateMessageId()
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            // If no local response, call the API
            let responseContent = '';
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "HTTP-Referer": SITE_URL,
                        "X-Title": SITE_NAME,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "deepseek/deepseek-chat:free",
                        "messages": [
                            { role: "system", content: systemContext },
                            ...messages.map(({ role, content }) => ({ role, content })),
                            { role: "user", content: input.trim() }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ChatResponse = await response.json();
                responseContent = data.choices[0].message.content;

                if (responseContent.trim()) break;
                retryCount++;
            }

            if (!responseContent.trim()) {
                responseContent = "Maaf, saya tidak bisa memberikan jawaban saat ini. Silakan coba lagi nanti.";
            }

            setTypingIndicator(false);

            // Add streaming message
            const messageId = generateMessageId();
            const streamingMessage: Message = {
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                isStreaming: true,
                id: messageId
            };

            setMessages(prev => [...prev, streamingMessage]);

            // Simulate streaming effect
            await streamText(responseContent, (streamedText) => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages.find(msg => msg.id === messageId);
                    if (lastMessage && lastMessage.isStreaming) {
                        lastMessage.content = streamedText;
                    }
                    return [...newMessages];
                });
            });

            // Update final message
            setMessages(prev => {
                const newMessages = [...prev];
                const messageIndex = newMessages.findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1 && newMessages[messageIndex].isStreaming) {
                    newMessages[messageIndex] = {
                        ...newMessages[messageIndex],
                        content: responseContent,
                        isStreaming: false
                    };
                }
                return [...newMessages];
            });

        } catch (err) {
            setTypingIndicator(false);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Message variants for animation
    const messageVariants = {
        hidden: (isUser: boolean) => ({
            opacity: 0,
            x: isUser ? 20 : -20,
            y: 10,
            scale: 0.95,
        }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 300,
                duration: 0.4
            }
        },
        exit: (isUser: boolean) => ({
            opacity: 0,
            x: isUser ? 20 : -20,
            scale: 0.9,
            transition: { duration: 0.2 }
        })
    };

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 300,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    // Get time string in cleaner format
    const getTimeString = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className='max-w-5xl mx-auto px-4 sm:px-6 py-6'>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full bg-white rounded-2xl shadow-xl overflow-hidden relative"
            >
                {/* Enhanced Gradient Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 p-4 sm:p-5 relative overflow-hidden"
                >
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="w-40 h-40 rounded-full bg-pink-500/20 absolute -top-20 -right-20 blur-xl"
                        />
                        <motion.div
                            animate={{
                                rotate: [360, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="w-60 h-60 rounded-full bg-blue-500/20 absolute -bottom-40 -left-20 blur-xl"
                        />
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                damping: 12,
                                stiffness: 200,
                                delay: 0.3
                            }}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30"
                        >
                            <img
                                src="/images/photo-pin.webp"
                                alt="Dena-Warza"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
                            >
                                Dena-Warza
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                </motion.span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-indigo-100 text-sm"
                            >
                                Asisten Pribadi untuk Defano & Najmita
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-2 mt-1"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-indigo-100">Online</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Chat Container with enhanced scrollbar */}
                <motion.div
                    ref={chatContainerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="h-[calc(100vh-280px)] min-h-[380px] max-h-[500px] overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50 to-white scrollbar-custom"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#d1d5db transparent'
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                custom={message.role === 'user'}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={messageVariants}
                                layout
                                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 400 }}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100 shadow-md"
                                    >
                                        <img
                                            src="/images/ngedate/photo-both/photo-both2.webp"
                                            alt="Dena-Warza"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className={`max-w-[85%] rounded-xl p-3 sm:p-4 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white ml-auto rounded-tr-none shadow-lg shadow-blue-500/20'
                                        : 'bg-white border border-indigo-100 text-gray-800 rounded-tl-none shadow-md'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                                        {message.content}
                                        {message.isStreaming && (
                                            <motion.span
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="inline-block w-1.5 h-4 bg-current ml-1"
                                            />
                                        )}
                                    </p>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className={`text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                            {getTimeString(message.timestamp)}
                                        </span>
                                        {message.role === 'assistant' && (
                                            <Heart className="w-3.5 h-3.5 text-pink-400" />
                                        )}
                                    </div>
                                </motion.div>
                                {message.role === 'user' && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 15, stiffness: 400, delay: 0.1 }}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100 shadow-md"
                                    >
                                        <img
                                            src="https://e7.pngegg.com/pngimages/91/460/png-clipart-avatar-computer-icons-logo-grapher-logo-black.png"
                                            alt="User"
                                            className="w-full h-full object-cover bg-gray-100"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Enhanced typing indicator */}
                    <AnimatePresence>
                        {typingIndicator && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100">
                                    <img
                                        src="/images/ngedate/photo-both/photo-both2.webp"
                                        alt="Dena-Warza"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="bg-white border border-indigo-100 rounded-xl rounded-tl-none p-3 shadow-md flex items-center gap-1.5">
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error message with improved styling */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-sm border border-red-100 shadow-sm"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                </motion.div>

                {/* Enhanced Input Form with floating animation */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                    onSubmit={handleSubmit}
                    className="p-3 sm:p-4 border-t border-indigo-100 bg-gradient-to-b from-white to-indigo-50"
                >
                    <motion.div
                        initial={{ y: 10 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                        className="flex gap-2 items-center bg-white p-1 rounded-xl shadow-lg shadow-indigo-100/50 border border-indigo-100"
                    >
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pesan untuk Defano & Najmita..."
                                className="w-full p-2.5 sm:p-3 rounded-lg focus:outline-none bg-transparent placeholder-gray-400 text-gray-800 text-sm sm:text-base pl-3"
                                disabled={isLoading}
                            />
                            {input.length > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute bottom-0 right-2"
                                >
                                    <MessageCircle className="w-4 h-4 text-indigo-400 animate-pulse" />
                                </motion.div>
                            )}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#4f46e5' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-indigo-500/20"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default DenaWarzaChat;