import { useState } from 'react';
import { processQuestion } from './learning/questionProcessor';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { User , Heart, Calendar } from 'lucide-react';

const ChatbotUI = () => {
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const categories = {
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
    };

    const categoryIcons: any = {
        "Pribadi Defano": User,
        "Pribadi Najmita": User,
        "Hubungan": Heart,
        "Keseharian": Calendar
    };

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
        setAnswer(processQuestion(question));
    };

    return (
        <div className="max-w-7xl mx-auto py-3 md:py-8 mt-3">
            <div className="bg-gradient-to-br from-violet-50 to-pink-50 shadow-lg rounded-lg">
                <div className="p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            Tanya Defano & Najmita
                        </h2>
                        <p className="text-gray-600 text-xs md:text-sm mt-1">Pilih pertanyaan untuk mengenal mereka lebih dekat</p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/2">
                            <Tab.Group>
                                <Tab.List className="flex space-x-1 rounded-xl bg-violet-100/60 p-1">
                                    {Object.keys(categories).map((category) => {
                                        const Icon = categoryIcons[category];
                                        return (
                                            <Tab
                                                key={category}
                                                className={({ selected }) =>
                                                    `w-full rounded-lg py-2 text-xs md:text-sm font-medium leading-5 flex items-center justify-center gap-1
                                                    transition-all duration-200 outline-none cursor-pointer
                                                    ${selected
                                                        ? 'bg-white text-violet-700 shadow-sm'
                                                        : 'text-violet-600 md:hover:bg-white/40 md:hover:text-violet-700'
                                                    }`
                                                }
                                            >
                                                <Icon className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="hidden md:inline">{category}</span>
                                            </Tab>
                                        );
                                    })}
                                </Tab.List>
                                <Tab.Panels className="mt-3">
                                    {Object.values(categories).map((questions, idx) => (
                                        <Tab.Panel
                                            key={idx}
                                            className="space-y-1.5 h-[300px] md:h-[400px] overflow-y-auto rounded-sm bg-white shadow-lg p-2 md:p-3"
                                        >
                                            {questions.map((question, qIdx) => (
                                                <motion.button
                                                    key={qIdx}
                                                    whileHover={{ scale: 1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleQuestionSelect(question)}
                                                    className={`w-full text-left p-2.5 rounded-sm shadow-sm text-xs md:text-sm cursor-pointer transition-all duration-200
                                                        ${selectedQuestion === question
                                                            ? 'bg-violet-600 text-white shadow-md'
                                                            : 'bg-violet-50 md:hover:bg-violet-100 text-gray-700'
                                                        }`}
                                                >
                                                    {question}
                                                </motion.button>
                                            ))}
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/80 h-[300px] md:h-[460px] rounded-xl shadow-md border border-violet-100/50 p-4 overflow-y-auto"
                            >
                                {answer ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                D&N
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 text-xs md:text-sm leading-relaxed">{answer}</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500 text-xs md:text-sm">
                                        Pilih pertanyaan untuk melihat jawaban...
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotUI;