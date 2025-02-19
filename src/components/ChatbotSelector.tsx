import { useState, useEffect } from 'react';
import { Bot, MessageSquare, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import DenaWarzaChat from './DenaWarzaChat';
import ChatbotUI from './ChatbotUI';
import { useIsMobile } from '../hooks/isMobile';

interface Version {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    component: React.ComponentType;
}

const ChatbotVersionSelector = (): JSX.Element => {
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const versions: Version[] = [
        {
            id: 'v1',
            title: 'ChatBot V1',
            description: 'Tanya jawab dengan template pertanyaan',
            icon: <MessageSquare className="w-8 md:w-12 h-8 md:h-12 text-slate-600" />,
            component: ChatbotUI
        },
        {
            id: 'v2',
            title: 'ChatBot V2',
            description: 'Chat langsung dengan AI Dena-Warza',
            icon: <Bot className="w-8 md:w-12 h-8 md:h-12 text-slate-600" />,
            component: DenaWarzaChat
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const curtainVariants = {
        hidden: { scaleY: 0, originY: 0 },
        visible: {
            scaleY: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: {
            scaleY: 0,
            originY: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: !isMobile ? {
            y: -5,
            transition: { duration: 0.2 }
        } : {},
        tap: { scale: 0.98 }
    };

    const handleCardHover = (id: string | null) => {
        if (!isMobile) {
            setHoveredCard(id);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {selectedVersion ? (
                <div className="relative w-full h-full">
                    {/* Background curtain effect */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={curtainVariants}
                        className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white"
                    />

                    {/* Main content with fade in */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.3 }
                        }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-full"
                    >
                        <motion.button
                            onClick={() => setSelectedVersion(null)}
                            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/90 shadow-md hover:bg-white/95 transition-all duration-200 flex items-center justify-center"
                            whileHover={!isMobile ? {
                                scale: 1.05,
                                rotate: [0, -10, 10, 0],
                                transition: { duration: 0.3 }
                            } : {}}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    delay: 0.6,
                                    duration: 0.3
                                }
                            }}
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </motion.button>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: {
                                    delay: 0.4,
                                    duration: 0.5
                                }
                            }}
                            className="w-full h-full"
                        >
                            {(() => {
                                const selectedVersionData = versions.find(v => v.id === selectedVersion);
                                const SelectedComponent = selectedVersionData?.component;
                                return SelectedComponent ? <SelectedComponent /> : null;
                            })()}
                        </motion.div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    key="version-selector"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden"
                >
                    <div className="max-w-5xl w-full mx-auto px-4 md:px-6 py-12">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                                Pilih Versi Chatbot
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Pilih versi chatbot yang ingin Anda gunakan untuk berinteraksi
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {versions.map((version, i) => (
                                <motion.div
                                    key={version.id}
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onHoverStart={() => handleCardHover(version.id)}
                                    onHoverEnd={() => handleCardHover(null)}
                                >
                                    <button
                                        onClick={() => setSelectedVersion(version.id)}
                                        className="w-full h-full"
                                    >
                                        <Card className={`
                                            relative overflow-hidden h-full
                                            border border-slate-200
                                            transition-all duration-300
                                            ${hoveredCard === version.id && !isMobile ? 'shadow-lg scale-[1.02]' : 'shadow-md'}
                                            bg-white
                                        `}>
                                            <CardContent className="p-6 md:p-8">
                                                <div className="flex items-start space-x-6">
                                                    <motion.div
                                                        className="flex-shrink-0"
                                                        whileHover={!isMobile ? {
                                                            rotate: [0, -10, 10, 0],
                                                            transition: { duration: 0.5 }
                                                        } : {}}
                                                    >
                                                        {version.icon}
                                                    </motion.div>
                                                    <div className="flex-grow text-left">
                                                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                                            {version.title}
                                                        </h2>
                                                        <p className="text-slate-600 text-lg">
                                                            {version.description}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        className="flex-shrink-0"
                                                        animate={hoveredCard === version.id && !isMobile ? {
                                                            x: [0, 5, 0],
                                                            transition: {
                                                                duration: 0.5,
                                                                repeat: Infinity
                                                            }
                                                        } : {}}
                                                    >
                                                        <ArrowRight className="w-6 h-6 text-slate-400" />
                                                    </motion.div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatbotVersionSelector;