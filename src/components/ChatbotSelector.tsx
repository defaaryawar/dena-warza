import { useState } from 'react';
import { Bot, MessageSquare, ArrowRight, X } from 'lucide-react';
import DenaWarzaChat from './DenaWarzaChat';
import ChatbotUI from './ChatbotUI';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotVersionSelector = () => {
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

    const versions = [
        {
            id: 'v1',
            title: 'ChatBot V1',
            description: 'Tanya jawab dengan template pertanyaan',
            icon: <MessageSquare className="w-8 md:w-12 h-8 md:h-12 text-pink-500" />,
            component: ChatbotUI
        },
        {
            id: 'v2',
            title: 'ChatBot V2',
            description: 'Chat langsung dengan AI Dena-Warza',
            icon: <Bot className="w-8 md:w-12 h-8 md:h-12 text-violet-500" />,
            component: DenaWarzaChat
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -45, originX: 0, originY: 0 },
        visible: { opacity: 1, scale: 1, rotate: 0, originX: 0, originY: 0 },
        exit: { opacity: 0, scale: 0.8, rotate: 45, originX: 1, originY: 1 }
    };

    if (selectedVersion) {
        const SelectedComponent = versions.find(v => v.id === selectedVersion)?.component;

        return (
            <AnimatePresence>
                <motion.div
                    key="selected"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative py-4 md:py-8"
                >
                    <button
                        onClick={() => setSelectedVersion(null)}
                        className="absolute top-6 right-6 z-50 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Close chatbot"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                    {SelectedComponent && <SelectedComponent />}
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-violet-50 via-white to-pink-50 py-8 md:py-12"
        >
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        Pilih Versi Chatbot
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Pilih versi chatbot yang ingin Anda gunakan untuk berinteraksi
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {versions.map((version) => (
                        <motion.button
                            key={version.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedVersion(version.id)}
                            className="group bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 md:space-x-4">
                                    {version.icon}
                                    <div className="text-left">
                                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
                                            {version.title}
                                        </h2>
                                        <p className="text-gray-600 text-xs md:text-sm">
                                            {version.description}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-violet-500 transition-colors" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatbotVersionSelector;