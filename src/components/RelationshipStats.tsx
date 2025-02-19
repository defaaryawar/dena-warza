import React, { useState, useMemo, Suspense, lazy, memo, useEffect } from 'react';
import { Calendar, Gift, Heart, Book, Star } from 'lucide-react';

// Lazy load NotebookModal
const NotebookModal = lazy(() => import('./modal/NotebookModal'));

interface CountdownProps {
    targetDate: string;
    label: string;
    delay: number;
}

// Memoized Countdown component with animation
const Countdown: React.FC<CountdownProps> = memo(({ targetDate, label, delay }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const timeLeft = useMemo(() => {
        const difference = +new Date(targetDate) - +new Date();
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return `${days} hari`;
    }, [targetDate]);

    return (
        <div
            className={`text-center flex-1 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
        >
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{timeLeft}</div>
            <div className="text-xs sm:text-sm text-gray-600">{label}</div>
        </div>
    );
});

const RelationshipStats: React.FC = () => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        // Trigger main content visibility with a slight delay
        const timer = setTimeout(() => setContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Function to get the next date
    const getNextDate = (month: number, day: number) => {
        const now = new Date();
        let year = now.getFullYear();
        let date = new Date(year, month - 1, day);

        if (date < now) {
            date = new Date(year + 1, month - 1, day);
        }

        return date.toISOString();
    };

    // Memoize dates to avoid recalculating on every render
    const anniversaryDate = useMemo(() => getNextDate(9, 27), []);
    const defanoBirthday = useMemo(() => getNextDate(10, 13), []);
    const najmitaBirthday = useMemo(() => getNextDate(5, 17), []);

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-4 py-0 md:mb-0 sm:mb-0 sm:py-0">
            <div
                className={`bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
            >
                {/* Profile Section with staggered animations */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 sm:p-6 text-white overflow-hidden">
                    <h2
                        className={`text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 transition-all duration-700 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        Perjalanan Kami
                    </h2>
                    <div className="flex justify-center gap-4 sm:gap-8">
                        {/* Defano Profile with animation */}
                        <div
                            className={`text-center transition-all duration-700 delay-300 transform ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                }`}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-defa.webp"
                                    alt="Defano"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-sm sm:text-base font-medium">Defano</div>
                        </div>

                        {/* Heart Icon with beating animation */}
                        <div
                            className={`flex items-center transition-all duration-700 delay-500 transform ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                }`}
                        >
                            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-300 animate-pulse" />
                        </div>

                        {/* Najmita Profile with animation */}
                        <div
                            className={`text-center transition-all duration-700 delay-700 transform ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                }`}
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 overflow-hidden rounded-full border-4 border-white">
                                <img
                                    src="/images/photo-profil/photo-profil-nami.webp"
                                    alt="Najmita"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-sm sm:text-base font-medium">Najmita</div>
                        </div>
                    </div>
                </div>

                {/* Countdown Grid with staggered animations */}
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Anniversary Countdown */}
                        <div
                            className={`bg-blue-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 shadow-sm transition-all duration-700 delay-900 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={anniversaryDate}
                                label="Menuju Anniversary"
                                delay={1100}
                            />
                        </div>

                        {/* Defano's Birthday */}
                        <div
                            className={`bg-purple-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 shadow-sm transition-all duration-700 delay-1100 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={defanoBirthday}
                                label="Menuju Ultah Defano Arya Wardhana"
                                delay={1300}
                            />
                        </div>

                        {/* Najmita's Birthday */}
                        <div
                            className={`bg-pink-50 p-4 sm:p-6 rounded-xl flex items-center gap-3 sm:gap-4 shadow-sm transition-all duration-700 delay-1300 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <Countdown
                                targetDate={najmitaBirthday}
                                label="Menuju Ultah Najmita Zahira Dirgantoro"
                                delay={1500}
                            />
                        </div>
                    </div>

                    {/* Special Features with animations */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Notebook - Clickable with hover effect */}
                        <div
                            className={`bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-700 delay-1500 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                                    <Book className="w-5 h-5 text-orange-500" />
                                    Our Notebook
                                </h3>
                                <button
                                    onClick={() => setIsNotebookOpen(true)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg md:hover:bg-orange-600 md:hover:scale-105 cursor-pointer transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                                >
                                    Buka Notebook
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Buka notebook untuk membaca cerita kita berdua... ❤️
                            </p>
                        </div>

                        {/* Special Moments */}
                        <div
                            className={`bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-700 delay-1700 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                        >
                            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-purple-500" />
                                Momen Spesial
                            </h3>
                            <div
                                className={`space-y-3 transition-all duration-700 delay-1900 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}
                            >
                                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                                    <div className="text-xs sm:text-sm font-medium text-purple-600">Hari Jadi</div>
                                    <div className="text-sm sm:text-base text-gray-600">27 September 2024</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lazy-loaded Notebook Modal */}
            <Suspense fallback={
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            }>
                <NotebookModal
                    isOpen={isNotebookOpen}
                    onClose={() => setIsNotebookOpen(false)}
                />
            </Suspense>
        </div>
    );
};

export default RelationshipStats;