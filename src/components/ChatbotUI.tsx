import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import {
    User, Heart, Calendar, MessageCircle, Search,
    Sparkles, LucideProps
} from 'lucide-react';
import { processQuestion } from './learning/questionProcessor';

const ChatbotUI = () => {
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

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

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
        setIsTyping(true);
        setAnswer('');
        setIsExpanded(true);

        // Simulate typing effect with dynamic timing
        const words = question.split(' ').length;
        const typingTime = Math.min(1000 + words * 100, 3000);

        setTimeout(() => {
            setAnswer(processQuestion(question)); // Use processQuestion here
            setIsTyping(false);
        }, typingTime);
    };

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
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        },
        hover: {
            scale: 1.02,
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            transition: { duration: 0.2 }
        }
    };

    const answerContainerVariants = {
        collapsed: { height: "100px" },
        expanded: { height: "500px" }
    };

    return (
        <motion.div
            className="max-w-6xl mx-auto p-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 md:p-8">
                    {/* Animated Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="inline-block mb-4"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 4
                            }}
                        >
                            <Sparkles className="w-8 h-8 text-violet-500" />
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Tanya Defano & Najmita
                        </h2>
                        <p className="text-gray-600">Pilih pertanyaan untuk mengenal kami lebih dekat</p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Questions Section */}
                        <div className="md:w-1/2">
                            <Tab.Group onChange={setSelectedCategory}>
                                <Tab.List className="flex space-x-2 rounded-xl bg-white/50 p-1.5">
                                    {Object.keys(categories).map((category, index) => {
                                        const Icon = categoryIcons[category];
                                        return (
                                            <Tab
                                                key={category}
                                                className={({ selected }) =>
                                                    `flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 outline-none cursor-pointer 
                        flex items-center justify-center gap-2 transition-all duration-200
                        ${selected
                                                        ? 'bg-white text-violet-700 shadow-md'
                                                        : 'text-violet-600 hover:bg-white/80 hover:text-violet-700'
                                                    }`
                                                }
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span className="hidden md:inline">{category}</span>
                                                </motion.div>
                                            </Tab>
                                        );
                                    })}
                                </Tab.List>
                                <Tab.Panels className="mt-4">
                                    {Object.values(categories).map((questions, idx) => (
                                        <Tab.Panel
                                            key={idx}
                                            className="bg-white rounded-xl shadow-lg p-4 space-y-2 h-[400px] overflow-y-auto custom-scrollbar"
                                        >
                                            <AnimatePresence mode="wait">
                                                {questions.map((question, qIdx) => (
                                                    <motion.button
                                                        key={qIdx}
                                                        variants={questionVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        whileHover="hover"
                                                        onClick={() => handleQuestionSelect(question)}
                                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200
                              ${selectedQuestion === question
                                                                ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md'
                                                                : 'bg-violet-50 text-gray-700'
                                                            }`}
                                                        style={{ originX: 0 }}
                                                        transition={{ delay: qIdx * 0.1 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Search className="w-4 h-4" />
                                                            <span className="text-sm">{question}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </AnimatePresence>
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        {/* Answer Section */}
                        <motion.div
                            className="md:w-1/2"
                            variants={answerContainerVariants}
                            animate={isExpanded ? "expanded" : "collapsed"}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden flex flex-col">
                                <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-pink-50">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-violet-600" />
                                        <span className="font-medium text-violet-700">Jawaban</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    <AnimatePresence mode="wait">
                                        {isTyping ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 p-3"
                                            >
                                                <div className="flex space-x-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-2 h-2 bg-violet-400 rounded-full"
                                                            animate={{
                                                                y: ["0%", "-50%", "0%"]
                                                            }}
                                                            transition={{
                                                                duration: 0.6,
                                                                repeat: Infinity,
                                                                delay: i * 0.2
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">Sedang mengetik...</span>
                                            </motion.div>
                                        ) : answer ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-start gap-3 p-2"
                                            >
                                                <div className="flex-shrink-0">
                                                    <motion.div
                                                        className="w-8 h-8 rounded-full overflow-hidden"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        {selectedQuestion.toLowerCase().includes('defano') ? (
                                                            <img
                                                                src="/images/photo-profil/photo-profil-defa.webp"
                                                                alt="Defano"
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : selectedQuestion.toLowerCase().includes('najmita') ? (
                                                            <img
                                                                src="/images/photo-profil/photo-profil-nami.webp"
                                                                alt="Najmita"
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs">
                                                                D&N
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </div>
                                                <motion.div
                                                    className="flex-1"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <p className="text-gray-800 text-sm leading-relaxed">{answer}</p>
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-full flex flex-row items-center justify-center text-gray-500 gap-3"
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.1, 1],
                                                        rotate: [0, 10, -10, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        repeatDelay: 1
                                                    }}
                                                >
                                                    <Search className="w-6 h-6" />
                                                </motion.div>
                                                <p className="text-sm">Pilih pertanyaan untuk melihat jawaban...</p>
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