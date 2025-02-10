import { useState } from 'react';
import { processQuestion } from './learning/questionProcessor';
import { Tab } from '@headlessui/react';
import { User, Heart, Calendar, MessageCircle, Search } from 'lucide-react';

const ChatbotUI = () => {
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(false);

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

    const categoryIcons:any = {
        "Pribadi Defano": User,
        "Pribadi Najmita": User,
        "Hubungan": Heart,
        "Keseharian": Calendar
    };

    const handleQuestionSelect = (question:any) => {
        setSelectedQuestion(question);
        setIsTyping(true);
        setAnswer('');

        // Simulate typing effect
        setTimeout(() => {
            setAnswer(processQuestion(question));
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto py-3 md:py-8 px-0">
            <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Tanya Defano & Najmita
                        </h2>
                        <p className="text-gray-600 text-sm">Pilih pertanyaan untuk mengenal kami lebih dekat</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Questions Section */}
                        <div className="md:w-1/2">
                            <Tab.Group>
                                <Tab.List className="flex space-x-2 rounded-xl bg-white/50 p-1.5">
                                    {Object.keys(categories).map((category) => {
                                        const Icon = categoryIcons[category];
                                        return (
                                            <Tab
                                                key={category}
                                                className={({ selected }) =>
                                                    `flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 
                                                    flex items-center justify-center gap-2 transition-all duration-200
                                                    ${selected
                                                        ? 'bg-white text-violet-700 shadow-md'
                                                        : 'text-violet-600 hover:bg-white/80 hover:text-violet-700'
                                                    }`
                                                }
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="hidden md:inline">{category}</span>
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
                                            {questions.map((question, qIdx) => (
                                                <button
                                                    key={qIdx}
                                                    onClick={() => handleQuestionSelect(question)}
                                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200
                                                        ${selectedQuestion === question
                                                            ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md'
                                                            : 'bg-violet-50 hover:bg-violet-100 text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Search className="w-4 h-4" />
                                                        <span className="text-sm">{question}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </Tab.Group>
                        </div>

                        {/* Answer Section */}
                        <div className="md:w-1/2">
                            <div className="bg-white rounded-xl shadow-lg h-[500px] overflow-hidden flex flex-col">
                                <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-pink-50">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-violet-600" />
                                        <span className="font-medium text-violet-700">Jawaban</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    {isTyping ? (
                                        <div className="flex items-center gap-2 p-3">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100" />
                                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200" />
                                            </div>
                                            <span className="text-sm text-gray-500">Sedang mengetik...</span>
                                        </div>
                                    ) : answer ? (
                                        <div className="flex items-start gap-3 p-2">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                    {selectedQuestion.toLowerCase().includes('defano') ? (
                                                        <img
                                                            src="/images/photo-profil/photo-profil-defa.webp"
                                                            alt="Defano"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : selectedQuestion.toLowerCase().includes('najmita') ? (
                                                        <img
                                                            src="/images/photo-profil/photo-profil-nami.webp"
                                                            alt="Najmita"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs">
                                                            D&N
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-800 text-sm leading-relaxed">{answer}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                                            <Search className="w-6 h-6" />
                                            <p className="text-sm">Pilih pertanyaan untuk melihat jawaban...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotUI;