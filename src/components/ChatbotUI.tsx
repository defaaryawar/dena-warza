import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import {
    User, Heart, Calendar, MessageCircle, Search,
    Sparkles, Brain, LucideProps, Lightbulb
} from 'lucide-react';
import { processQuestion } from './learning/questionProcessor';
import { useIsMobile } from '../hooks/isMobile';

const ChatbotUI = () => {
    const isMobile = useIsMobile();
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [displayedAnswer, setDisplayedAnswer] = useState('');
    const answerContainerRef = useRef<HTMLDivElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const categories = useMemo(() => ({
        "Pribadi Defano": [
            "Ceritakan tentang Defano",
            "Apa hobi Defano?",
            "Bagaimana sifat Defano?",
            "Apa makanan kesukaan Defano?",
            "Bagaimana Defano kalau marah?",
            "Apa yang Defano suka?",
            "Bagaimana Defano menghabiskan waktu?",
            "Apa yang membuat Defano unik?"
        ],
        "Pribadi Najmita": [
            "Ceritakan tentang Najmita",
            "Apa hobi Najmita?",
            "Bagaimana sifat Najmita?",
            "Bagaimana penampilan Najmita?",
            "Apa yang Najmita butuhkan?",
            "Apa kesukaan Najmita?",
            "Bagaimana Najmita sehari-hari?",
            "Apa yang spesial dari Najmita?"
        ],
        "Hubungan": [
            "Bagaimana hubungan mereka?",
            "Apa yang membuat mereka cocok?",
            "Bagaimana mereka saling melengkapi?",
            "Apa yang spesial dari hubungan mereka?",
            "Bagaimana mereka mengatasi perbedaan?"
        ],
        "Keseharian": [
            "Apa kegiatan mereka sehari-hari?",
            "Bagaimana mereka menghabiskan waktu?",
            "Apa yang mereka suka lakukan bersama?",
            "Bagaimana mereka menunjukkan kasih sayang?"
        ]
    }), []);

    const categoryIcons: Record<string, React.ComponentType<LucideProps>> = {
        "Pribadi Defano": User,
        "Pribadi Najmita": User,
        "Hubungan": Heart,
        "Keseharian": Calendar
    };

    // Streaming effect for answer display with cleanup
    useEffect(() => {
        if (!isTyping || !answer) return;

        let index = 0;
        const answerLength = answer.length;
        setDisplayedAnswer('');

        // Clear existing interval if any
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        typingIntervalRef.current = setInterval(() => {
            if (index < answerLength) {
                setDisplayedAnswer(prev => prev + answer[index]);
                index++;

                // Scroll to bottom as text appears
                if (answerContainerRef.current) {
                    answerContainerRef.current.scrollTop = answerContainerRef.current.scrollHeight;
                }
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                    typingIntervalRef.current = null;
                }
                setIsTyping(false);
            }
        }, 20); // Adjust speed of typing

        // Cleanup function
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
        };
    }, [isTyping, answer]);

    // Cleanup all animations and intervals when component unmounts
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    const handleQuestionSelect = (question: string) => {
        // Clear any existing intervals
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }

        // If clicking the same question again, reset everything
        if (selectedQuestion === question) {
            // Reset to initial state with animation
            setIsThinking(false);
            setIsTyping(false);
            setDisplayedAnswer('');
            setAnswer('');

            // Add a small delay before resetting selection to allow animation
            setTimeout(() => {
                setSelectedQuestion('');
                setIsExpanded(false);
            }, 300);
            return;
        }

        // Otherwise, proceed with new question
        setSelectedQuestion(question);
        setIsThinking(true);
        setAnswer('');
        setDisplayedAnswer('');
        setIsExpanded(true);

        // Thinking animation before typing
        setTimeout(() => {
            setIsThinking(false);
            setIsTyping(true);

            // Ensure we have a valid response from processQuestion
            const processedAnswer = processQuestion(question) || "Maaf, saya tidak bisa menjawab pertanyaan ini saat ini.";
            setAnswer(processedAnswer);
        }, isMobile ? 1000 : 2500); // Shorter thinking time on mobile
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const questionVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                delay: i * 0.08
            }
        }),
        hover: !isMobile ? {
            scale: 1.02,
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.1)",
            transition: { duration: 0.2 }
        } : {}
    };

    const answerContainerVariants = {
        collapsed: { height: "100px" },
        expanded: { height: "500px" }
    };

    // Theme colors - updated to a more vibrant purple/teal gradient
    const gradientBg = "bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50";
    const primaryColor = "text-indigo-600";
    const buttonGradient = "bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500";

    // Helper function to get avatar by name with proper checking
    const getAvatarByName = (question: string) => {
        if (question.toLowerCase().includes("defano")) {
            return {
                src: "/images/photo-profil/photo-profil-defa.webp",
                alt: "Defano",
                name: "Defano"
            };
        } else if (question.toLowerCase().includes("najmita")) {
            return {
                src: "/images/photo-profil/photo-profil-nami.webp",
                alt: "Najmita",
                name: "Najmita"
            };
        } else {
            return {
                src: "",
                alt: "D&N",
                name: "Defano & Najmita"
            };
        }
    };

    return (
        <motion.div
            className="max-w-5xl mx-auto p-3"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className={`${gradientBg} rounded-xl shadow-lg overflow-hidden border border-indigo-100`}>
                <div className="p-4 md:p-6">
                    {/* Animated Header */}
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <motion.div
                            className="inline-block mb-3"
                            animate={!isMobile ? {
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                            } : {}}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 4
                            }}
                        >
                            <Sparkles className="w-7 h-7 text-indigo-500" />
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-1">
                            Tanya Defano & Najmita
                        </h2>
                        <p className="text-sm text-gray-600">Pilih pertanyaan untuk mengenal kami lebih dekat</p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Questions Section */}
                        <div className="md:w-1/2">
                            <Tab.Group onChange={setSelectedCategory}>
                                <Tab.List className="flex space-x-1 rounded-lg bg-white/70 p-1 shadow-sm">
                                    {Object.keys(categories).map((category) => {
                                        const Icon = categoryIcons[category];
                                        return (
                                            <Tab
                                                key={category}
                                                className={({ selected }) =>
                                                    `flex-1 rounded-md py-2 text-xs md:text-sm font-medium leading-5 outline-none cursor-pointer 
                                                    flex items-center justify-center gap-1 transition-all duration-200
                                                    ${selected
                                                        ? `${buttonGradient} text-white shadow-md`
                                                        : `text-indigo-600 hover:bg-white/80 hover:${primaryColor}`
                                                    }`
                                                }
                                            >
                                                <motion.div
                                                    whileHover={!isMobile ? { scale: 1.05 } : {}}
                                                    whileTap={!isMobile ? { scale: 0.95 } : {}}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Icon className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="hidden md:inline text-xs">{category}</span>
                                                </motion.div>
                                            </Tab>
                                        );
                                    })}
                                </Tab.List>
                                <Tab.Panels className="mt-3">
                                    {Object.values(categories).map((questions, idx) => (
                                        <Tab.Panel
                                            key={idx}
                                            className="bg-white rounded-lg shadow-md p-3 space-y-2 h-[300px] md:h-[350px] overflow-y-auto custom-scrollbar"
                                        >
                                            <AnimatePresence mode="wait">
                                                {questions.map((question, qIdx) => (
                                                    <motion.button
                                                        key={qIdx}
                                                        custom={qIdx}
                                                        variants={questionVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        whileHover="hover"
                                                        onClick={() => handleQuestionSelect(question)}
                                                        className={`w-full text-left p-3 rounded-md transition-all duration-200
                                                            ${selectedQuestion === question
                                                                ? `${buttonGradient} text-white shadow-md`
                                                                : 'bg-indigo-50/70 text-gray-700 hover:bg-indigo-100/70'
                                                            }`}
                                                        style={{ originX: 0 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Search className="w-3 h-3 md:w-4 md:h-4" />
                                                            <span className="text-xs md:text-sm">{question}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </AnimatePresence>
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        {/* Answer Section with Enhanced Animations */}
                        <motion.div
                            className="md:w-1/2"
                            variants={!isMobile ? answerContainerVariants : {}}
                            animate={isExpanded ? "expanded" : "collapsed"}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white rounded-lg shadow-md h-full overflow-hidden flex flex-col border border-indigo-100">
                                <div className="p-3 border-b bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-indigo-600" />
                                        <span className="font-medium text-sm text-indigo-700">Jawaban</span>
                                    </div>
                                </div>

                                <div
                                    ref={answerContainerRef}
                                    className="flex-1 overflow-y-auto p-4 custom-scrollbar"
                                >
                                    <AnimatePresence mode="wait">
                                        {isThinking ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="h-full flex flex-col items-center justify-center gap-4"
                                            >
                                                <motion.div
                                                    animate={!isMobile ? {
                                                        scale: [1, 1.1, 1],
                                                        rotateY: [0, 180, 360],
                                                    } : {}}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="relative"
                                                >
                                                    <Brain className="w-10 h-10 text-indigo-400" />
                                                    <motion.div
                                                        animate={!isMobile ? {
                                                            opacity: [0, 1, 0],
                                                            scale: [0.8, 1.2, 0.8],
                                                        } : {}}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                        }}
                                                        className="absolute -top-1 -right-1"
                                                    >
                                                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                                                    </motion.div>
                                                </motion.div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-sm font-medium text-indigo-700">Sedang membaca pertanyaan...</span>
                                                    <div className="flex space-x-2">
                                                        {[0, 1, 2, 3, 4].map((i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="w-2 h-2 rounded-full"
                                                                style={{
                                                                    background: `linear-gradient(90deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 50%, rgb(20, 184, 166) 100%)`
                                                                }}
                                                                animate={!isMobile ? {
                                                                    y: ["0%", "-100%", "0%"],
                                                                    opacity: [0.5, 1, 0.5]
                                                                } : {}}
                                                                transition={{
                                                                    duration: 0.6,
                                                                    repeat: Infinity,
                                                                    delay: i * 0.1
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : isTyping ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-start gap-2 p-2"
                                            >
                                                <div className="flex-shrink-0">
                                                    <motion.div
                                                        className="w-8 h-8 rounded-full overflow-hidden shadow-md"
                                                        whileHover={!isMobile ? { scale: 1.05 } : {}}
                                                    >
                                                        {(() => {
                                                            const avatar = getAvatarByName(selectedQuestion);
                                                            return avatar.src ? (
                                                                <img
                                                                    src={avatar.src}
                                                                    alt={avatar.alt}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                                                                    D&N
                                                                </div>
                                                            );
                                                        })()}
                                                    </motion.div>
                                                </div>
                                                <div className="flex-1 text-gray-800 text-sm md:text-base leading-relaxed">
                                                    {displayedAnswer}
                                                    <motion.span
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                        className="inline-block w-2 h-4 bg-indigo-400 ml-1"
                                                    />
                                                </div>
                                            </motion.div>
                                        ) : answer ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="flex items-start gap-3 p-2"
                                            >
                                                <div className="flex-shrink-0">
                                                    <motion.div
                                                        className="w-8 h-8 rounded-full overflow-hidden shadow-md"
                                                        whileHover={!isMobile ? { scale: 1.05 } : {}}
                                                    >
                                                        {(() => {
                                                            const avatar = getAvatarByName(selectedQuestion);
                                                            return avatar.src ? (
                                                                <img
                                                                    src={avatar.src}
                                                                    alt={avatar.alt}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 flex items-center justify-center text-white text-xs font-medium">
                                                                    D&N
                                                                </div>
                                                            );
                                                        })()}
                                                    </motion.div>
                                                </div>
                                                <motion.div
                                                    className="flex-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.15 }}
                                                >
                                                    <p className="text-gray-800 text-sm md:text-base leading-relaxed">{displayedAnswer}</p>
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-full flex flex-col md:flex-row items-center justify-center text-gray-500 gap-3"
                                            >
                                                <motion.div
                                                    animate={!isMobile ? {
                                                        scale: [1, 1.1, 1],
                                                        y: [0, -5, 0]
                                                    } : {}}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 1
                                                    }}
                                                    className="text-indigo-400"
                                                >
                                                    <Search className="w-8 h-8" />
                                                </motion.div>
                                                <p className="text-sm text-center px-4">Pilih pertanyaan untuk melihat jawaban tentang kami...</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ChatbotUI);