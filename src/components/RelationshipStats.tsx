import React, { useState } from 'react';
import { Calendar, Gift, Heart, Book, Star } from 'lucide-react';
import NotebookModal from './modal/NotebookModal';

interface CountdownProps {
    targetDate: string;
    label: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, label }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return `${days} day`;  
    };

    return (
        <div className="text-center flex-1">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{calculateTimeLeft()}</div>
            <div className="text-xs sm:text-sm text-gray-600">{label}</div>
        </div>
    );
};

const RelationshipStats: React.FC = () => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);

    const getNextDate = (month: number, day: number) => {
        const now = new Date();
        let year = now.getFullYear();
        let date = new Date(year, month - 1, day);

        if (date < now) {
            date = new Date(year + 1, month - 1, day);
        }

        return date.toISOString();
    };

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-4 py-0 md:mb-0 sm:mb-0 mb-8 sm:py-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                {/* Profile Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 sm:p-6 text-white">
                    <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Our Journey</h2>
                    <div className="flex justify-center gap-4 sm:gap-8">
                        {/* Defano Profile */}
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-defa.webp"
                                    alt="Defano"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-sm sm:text-base font-medium">Defano</div>
                        </div>

                        {/* Heart Icon */}
                        <div className="flex items-center">
                            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-300 animate-pulse" />
                        </div>

                        {/* Najmita Profile */}
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-nami.webp"
                                    alt="Najmita"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-sm sm:text-base font-medium">Najmita</div>
                        </div>
                    </div>
                </div>

                {/* Countdown Grid */}
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Anniversary Countdown */}
                        <div className="bg-blue-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 transform transition-all duration-300 shadow-sm">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(9, 27)}
                                label="Menuju Anniversary"
                            />
                        </div>

                        {/* Defano's Birthday */}
                        <div className="bg-purple-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 transform transition-all duration-300 shadow-sm">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(10, 13)}
                                label="Menuju Ultah Defano Arya Wardhana"
                            />
                        </div>

                        {/* Najmita's Birthday */}
                        <div className="bg-pink-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 transform transition-all duration-300 shadow-sm">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(5, 17)}
                                label="Menuju Ultah Najmita Zahira Dirgantoro"
                            />
                        </div>
                    </div>

                    {/* Special Features */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Notebook */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl transform transition-all duration-300 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                                    <Book className="w-5 h-5 text-orange-500" />
                                    Our Notebook
                                </h3>
                                <button
                                    onClick={() => setIsNotebookOpen(true)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                                >
                                    Open Notebook
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Buka notebook untuk membaca cerita kita berdua... ❤️
                            </p>
                        </div>

                        {/* Special Moments */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl transform transition-all duration-300 shadow-sm">
                            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-purple-500" />
                                Special Moments
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm transform transition-all duration-300">
                                    <div className="text-xs sm:text-sm font-medium text-purple-600">Hari Jadi</div>
                                    <div className="text-sm sm:text-base text-gray-600">27 September 2024</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notebook Modal */}
            <NotebookModal
                isOpen={isNotebookOpen}
                onClose={() => setIsNotebookOpen(false)}
            />
        </div>
    );
};

export default RelationshipStats;