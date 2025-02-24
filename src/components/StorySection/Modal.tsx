import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';

interface Story {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    fullStory: string;
}

interface ModalProps {
    story: Story;
    onClose: () => void;
    isOpen: boolean;
}

const Modal: React.FC<ModalProps> = React.memo(({ story, onClose, isOpen }) => {
    // Prevent scrolling on the body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevent event bubbling to backdrop
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: 1,
                        transition: { duration: 0.3 }
                    }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 0.3, delay: 0.1 }
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-purple-900/50" />
                    
                    <motion.div
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ 
                            scale: 1,
                            y: 0,
                            opacity: 1,
                            transition: { 
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                delay: 0.1
                            }
                        }}
                        exit={{ 
                            scale: 0.9,
                            y: 20,
                            opacity: 0,
                            transition: { duration: 0.3 }
                        }}
                        className="w-full max-w-2xl z-10"
                        onClick={handleCardClick}
                    >
                        <Card className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-0 relative">                           
                            <div className="relative max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <CardContent className="p-8">
                                    {/* Close Button with Animation */}
                                    <motion.button
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ 
                                            opacity: 1, 
                                            rotate: 0,
                                            transition: { delay: 0.5, duration: 0.3 }
                                        }}
                                        whileHover={{ 
                                            scale: 1.1,
                                            rotate: 90,
                                            transition: { duration: 0.2 }
                                        }}
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 z-10 shadow-md"
                                    >
                                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                                    </motion.button>

                                    {/* Header Section with Staggered Animation */}
                                    <div className="flex items-center mb-6 space-x-4">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -15 }}
                                            animate={{ 
                                                scale: 1, 
                                                rotate: 0,
                                                transition: { 
                                                    delay: 0.3,
                                                    type: "spring",
                                                    stiffness: 300
                                                }
                                            }}
                                            className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
                                        >
                                            {story.icon}
                                        </motion.div>
                                        
                                        <div className="flex flex-col">
                                            <motion.h2 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: 0,
                                                    transition: { delay: 0.4 }
                                                }}
                                                className="text-3xl font-bold text-gray-800 dark:text-white"
                                            >
                                                {story.title}
                                            </motion.h2>
                                            
                                            <motion.span 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: 0,
                                                    transition: { delay: 0.5 }
                                                }}
                                                className="text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                {story.date}
                                            </motion.span>
                                        </div>
                                    </div>

                                    {/* Animated Divider with Glow Effect */}
                                    <div className="relative py-4">
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ 
                                                scaleX: 1,
                                                transition: { delay: 0.6, duration: 0.6 }
                                            }}
                                            className="w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ 
                                                opacity: 0.5, 
                                                scaleX: 1,
                                                transition: { delay: 0.8, duration: 0.6 }
                                            }}
                                            className="absolute bottom-4 w-full h-[2px] blur-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
                                        />
                                    </div>

                                    {/* Content Section with Reveal Animation */}
                                    <div className="space-y-6">
                                        <motion.blockquote
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                y: 0,
                                                transition: { delay: 0.7 }
                                            }}
                                            className="pl-4 border-l-4 border-purple-500 italic"
                                        >
                                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                                "{story.description}"
                                            </p>
                                        </motion.blockquote>
                                        
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ 
                                                opacity: 1,
                                                transition: { delay: 0.9, duration: 0.5 }
                                            }}
                                        >
                                            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                                                {story.fullStory}
                                            </p>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default Modal;