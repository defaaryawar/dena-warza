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
        return `${days} hari`;
    };

    return (
        <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{calculateTimeLeft()}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
};

const RelationshipStats: React.FC = () => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);

    // Function to get next anniversary or birthday
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Profile Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                    <h2 className="text-2xl font-bold text-center mb-6">Our Journey</h2>
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-defa.webp"
                                    alt="Defano"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="font-medium">Defano</div>
                        </div>
                        <div className="flex items-center">
                            <Heart className="w-8 h-8 text-pink-300 animate-pulse" />
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-nami.webp"
                                    alt="Najmita"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="font-medium">Najmita</div>
                        </div>
                    </div>
                </div>

                {/* Countdown Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(9, 27)} // September 27
                                label="Menuju Anniversary"
                            />
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(10, 13)} // October 13
                                label="Ultah Defano"
                            />
                        </div>
                        <div className="bg-pink-50 p-6 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={getNextDate(5, 17)} // May 17
                                label="Ultah Najmita"
                            />
                        </div>
                    </div>

                    {/* Special Features */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Notebook */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl transform transition-transform">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Book className="w-5 h-5 text-orange-500" />
                                    Our Notebook
                                </h3>
                                <button
                                    onClick={() => setIsNotebookOpen(true)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer duration-300"
                                >
                                    Open Notebook
                                </button>
                            </div>
                            <p className="text-gray-600">
                                Buka notebook untuk membaca cerita kita berdua... ❤️
                            </p>
                        </div>

                        {/* Special Moments */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-purple-500" />
                                Special Moments
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="text-sm font-medium text-purple-600">Hari Jadi</div>
                                    <div className="text-gray-600">27 September 2024</div>
                                </div>
                                {/* <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
                                    <div className="text-sm font-medium text-purple-600">First Date</div>
                                    <div className="text-gray-600">15 Oktober 2023</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
                                    <div className="text-sm font-medium text-purple-600">Pantai Date</div>
                                    <div className="text-gray-600">20 November 2023</div>
                                </div> */}
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