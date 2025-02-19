import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, XCircle } from 'lucide-react';
import { processMessage } from './utils/processMessage';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
}

interface ChatResponse {
    choices: {
        message: {
            content: string;
            role: string;
        };
    }[];
}

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
    const [streamingContent, setStreamingContent] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    const SITE_URL = import.meta.env.VITE_SITE_URL;
    const SITE_NAME = import.meta.env.VITE_SITE_NAME;

    // Simulate streaming text effect
    const streamText = async (text: string, callback: (streamedText: string) => void) => {
        const words = text.split(' ');
        let currentText = '';

        for (const word of words) {
            currentText += word + ' ';
            callback(currentText);
            await new Promise(resolve => setTimeout(resolve, 50)); // Adjust speed here
        }
    };

    // Function to scroll to the bottom of the chat container
    const scrollToBottom = () => {
        if (chatContainerRef.current && messagesEndRef.current) {
            // Scroll hanya di dalam chat container
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Automatically scroll to bottom when messages or streaming content changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent]);

    useEffect(() => {
        if (isFirstMessage) {
            const welcomeMessage: Message = {
                role: 'assistant',
                content: "Halo! Saya Dena-Warza, asisten AI yang mengenal baik Najmita dan Defano. Bagaimana saya bisa membantu Anda hari ini? 😊",
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
            setIsFirstMessage(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setError(null);
        setIsLoading(true);

        try {
            // Process the message locally first
            let localResponse = processMessage(input.trim());

            // If the local response is different from the input, use it
            if (localResponse !== input.trim()) {
                const assistantMessage: Message = {
                    role: 'assistant',
                    content: localResponse,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
                return; // Stop here, no need to call the API
            }

            // If no local response, call the API
            let responseContent = '';
            let retryCount = 0;
            const maxRetries = 3; // Maximum number of retries

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

                // If response is not empty, break the loop
                if (responseContent.trim()) {
                    break;
                }

                retryCount++;
            }

            // If response is still empty after retries, provide a default response
            if (!responseContent.trim()) {
                responseContent = "Maaf, saya tidak bisa memberikan jawaban saat ini. Silakan coba lagi nanti.";
            }

            // Add streaming message
            const streamingMessage: Message = {
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                isStreaming: true
            };

            setMessages(prev => [...prev, streamingMessage]);

            // Simulate streaming effect
            await streamText(responseContent, (streamedText) => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.isStreaming) {
                        lastMessage.content = streamedText;
                    }
                    return newMessages;
                });
            });

            // Update final message
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.isStreaming) {
                    lastMessage.content = responseContent;
                    lastMessage.isStreaming = false;
                }
                return newMessages;
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='max-w-6xl mx-auto px-0'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-white rounded-2xl shadow-xl overflow-hidden relative"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                            <img
                                src="/images/photo-pin.webp"
                                alt="Dena-Warza"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Dena-Warza</h1>
                            <p className="text-purple-100">Personal AI Assistant</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-purple-100">Online</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Chat Container */}
                <motion.div
                    ref={chatContainerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="h-[600px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white"
                >
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src="/images/ngedate/photo-both/photo-both2.webp"
                                            alt="Dena-Warza"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white ml-auto rounded-tr-none'
                                        : 'bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                                        {message.content}
                                        {message.isStreaming && (
                                            <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                                        )}
                                    </p>
                                    <span className="text-xs opacity-70 mt-2 block">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src="https://e7.pngegg.com/pngimages/91/460/png-clipart-avatar-computer-icons-logo-grapher-logo-black.png"
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-gray-500 bg-white/80 p-4 rounded-lg shadow-sm"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Dena-Warza sedang mengetik...</span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-lg"
                        >
                            <XCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </motion.div>

                {/* Input Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onSubmit={handleSubmit}
                    className="p-6 border-t bg-white"
                >
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan Anda di sini..."
                            className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default DenaWarzaChat;