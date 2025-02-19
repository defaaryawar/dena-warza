import { useState } from 'react';
import { Bot, MessageSquare, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import DenaWarzaChat from './DenaWarzaChat';
import ChatbotUI from './ChatbotUI';

// Define types for the version object
interface Version {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    bgColor: string;
    borderColor: string;
    component: React.ComponentType;
}

const ChatbotVersionSelector = () => {
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const versions: Version[] = [
        {
            id: 'v1',
            title: 'ChatBot V1',
            description: 'Tanya jawab dengan template pertanyaan',
            icon: <MessageSquare className="w-8 md:w-12 h-8 md:h-12 text-pink-500" />,
            bgColor: 'from-pink-500/20 to-purple-500/20',
            borderColor: 'border-pink-500/50',
            component: ChatbotUI
        },
        {
            id: 'v2',
            title: 'ChatBot V2',
            description: 'Chat langsung dengan AI Dena-Warza',
            icon: <Bot className="w-8 md:w-12 h-8 md:h-12 text-violet-500" />,
            bgColor: 'from-violet-500/20 to-blue-500/20',
            borderColor: 'border-violet-500/50',
            component: DenaWarzaChat
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    if (selectedVersion) {
        const selectedVersionData = versions.find(v => v.id === selectedVersion);
        const SelectedComponent = selectedVersionData?.component;

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full h-full"
                >
                    <button
                        onClick={() => setSelectedVersion(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-200"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                    {SelectedComponent && <SelectedComponent />}
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center bg-gradient-to-br from-violet-300 via-black/30 to-pink-300 rounded-xl"
        >
            <div className="max-w-5xl w-full mx-auto px-4 md:px-6 py-12">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Pilih Versi Chatbot
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Pilih versi chatbot yang ingin Anda gunakan untuk berinteraksi
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {versions.map((version) => (
                        <motion.div
                            key={version.id}
                            variants={cardVariants}
                            whileHover="hover"
                            onHoverStart={() => setHoveredCard(version.id)}
                            onHoverEnd={() => setHoveredCard(null)}
                        >
                            <button
                                onClick={() => setSelectedVersion(version.id)}
                                className="w-full h-full cursor-pointer"
                            >
                                <Card className={`
                                    relative overflow-hidden h-full
                                    border-2 transition-all duration-300
                                    ${version.borderColor}
                                    ${hoveredCard === version.id ? 'shadow-2xl' : 'shadow-lg'}
                                `}>
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-br ${version.bgColor} opacity-20
                                        transition-opacity duration-300
                                        ${hoveredCard === version.id ? 'opacity-30' : 'opacity-20'}
                                    `} />

                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0">
                                                {version.icon}
                                            </div>
                                            <div className="flex-grow text-left">
                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                                    {version.title}
                                                </h2>
                                                <p className="text-gray-600 text-lg">
                                                    {version.description}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <ArrowRight className={`
                                                    w-6 h-6 text-gray-400 
                                                    transition-all duration-300
                                                    ${hoveredCard === version.id ? 'transform translate-x-1 text-violet-500' : ''}
                                                `} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatbotVersionSelector;