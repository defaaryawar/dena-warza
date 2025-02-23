import React, { useState, useMemo, Suspense, lazy, memo, useEffect } from 'react';
import { Calendar, Gift, Heart, Book, Star, Sparkles, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the NotebookModal
const NotebookModal = lazy(() => import('./modal/NotebookModal'));

// Define types
interface ProfileStats {
    birthday: string;
    zodiac: string;
    email: string;
    bio: string;
    image: string;
}

interface ProfileCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    profileImage: string;
    stats: ProfileStats;
}

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

interface CountdownProps {
    targetDate: string;
    label: string;
    delay: number;
}

interface ProfileSnowEffectProps {
    className?: string;
}

interface ProfileData {
    [key: string]: ProfileStats;
}

interface ProfileModalState {
    isOpen: boolean;
    name: string;
    profileImage: string;
    stats: ProfileStats | null;
}

interface GiftModalState {
    isOpen: boolean;
    name: string;
}

// Profile Card Modal Component
const ProfileCardModal: React.FC<ProfileCardModalProps> = ({ isOpen, onClose, name, profileImage, stats }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-996 p-4"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-xl w-full max-w-md transform transition-all"
                >
                    {/* Header with close button */}
                    <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        {/* Profile Image */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="w-54 h-54 rounded-full border-4 border-white overflow-hidden shadow-lg">
                                <img
                                    src={profileImage}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-20 pb-8 px-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
                            <p className="text-gray-500 mt-1">❤️ Forever Yours ❤️</p>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 md:grid-cols-3 gap-2">
                            <div className="bg-purple-50 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm font-medium text-purple-700">Birthday</span>
                                </div>
                                <p className="mt-1 text-gray-600">{stats.birthday}</p>
                            </div>

                            <div className="bg-pink-50 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-pink-500" />
                                    <span className="text-sm font-medium text-pink-700">Status</span>
                                </div>
                                <p className="mt-1 text-gray-600">In Love 💑</p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-700">Zodiac</span>
                                </div>
                                <p className="mt-1 text-gray-600">{stats.zodiac}</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 italic">"{stats.bio}"</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Enhanced Gift Modal Component
const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, name }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-999 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 max-w-sm w-full relative overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors cursor-pointer z-996"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="text-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl rotate-45 flex items-center justify-center">
                                <Gift className="w-10 h-10 text-white -rotate-45" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                Surprise untuk {name}! ✨
                            </h3>
                            <p className="text-gray-600">
                                {name === 'Defano' ?
                                    'Konten akan tersedia saat hari H!' :
                                    'Konten akan tersedia saat hari H! 💖'}
                            </p>
                        </div>

                        <div className="flex justify-center space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                >
                                    <Sparkles className="w-6 h-6 text-purple-500" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Custom hook to detect mobile devices
const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

// Countdown Component
const Countdown: React.FC<CountdownProps> = memo(({ targetDate, label, delay }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile(); // Gunakan hook useIsMobile

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
            className={`text-center flex-1 transition-all duration-700 transform cursor-pointer
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                ${!isMobile && isHovered ? 'scale-105' : 'scale-100'}`} // Matikan hover effect di mobile
            onMouseEnter={() => !isMobile && setIsHovered(true)} // Hanya aktif di desktop
            onMouseLeave={() => !isMobile && setIsHovered(false)} // Hanya aktif di desktop
        >
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {timeLeft}
            </div>
            <div className="text-sm md:text-base text-gray-600">{label}</div>
        </div>
    );
});

// Snow Effect Component
const ProfileSnowEffect: React.FC<ProfileSnowEffectProps> = ({ className }) => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {Array.from({ length: 15 }).map((_, index) => (
            <motion.div
                key={index}
                className="absolute w-1 h-1 bg-white rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: 100,
                }}
                transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2,
                }}
            />
        ))}
    </div>
);

// Main Component
const RelationshipStats: React.FC = () => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [giftModal, setGiftModal] = useState<GiftModalState>({ isOpen: false, name: '' });
    const [profileModal, setProfileModal] = useState<ProfileModalState>({
        isOpen: false,
        name: '',
        profileImage: '',
        stats: null,
    });

    const isMobile = useIsMobile();

    const profileData: ProfileData = {
        Defano: {
            birthday: '13 October',
            zodiac: 'Libra',
            email: 'defano@example.com',
            bio: 'Living life with love and laughter',
            image: '/images/photo-profil/photo-profil-defa.webp',
        },
        Najmita: {
            birthday: '17 May',
            zodiac: 'Taurus',
            email: 'najmita@example.com',
            bio: 'Spreading love and happiness everywhere',
            image: '/images/photo-profil/photo-profil-nami.webp',
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => setContentVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const getNextDate = (month: number, day: number): string => {
        const now = new Date();
        let year = now.getFullYear();
        let date = new Date(year, month - 1, day);
        if (date < now) {
            date = new Date(year + 1, month - 1, day);
        }
        return date.toISOString();
    };

    const anniversaryDate = useMemo(() => getNextDate(9, 27), []);
    const defanoBirthday = useMemo(() => getNextDate(10, 13), []);
    const najmitaBirthday = useMemo(() => getNextDate(5, 17), []);

    return (
        <div className="max-w-7xl mx-auto px-2 py-6 md:py-10">
            <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 transform 
                ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 md:p-10 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 relative">
                        ✨ Our Love Story ✨
                        <div className="text-base md:text-lg mt-2 opacity-80">Kisah cinta yang bikin baper~ 💕</div>
                    </h2>

                    {/* Profile Pictures */}
                    <div className="flex justify-center gap-6 md:gap-12 items-center">
                        <div className="relative">
                            <ProfileSnowEffect />
                            <div
                                className="w-24 h-24 md:w-36 md:h-36 overflow-hidden rounded-full border-4 border-white/80 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                                onClick={() => setProfileModal({
                                    isOpen: true,
                                    name: 'Defano',
                                    profileImage: profileData.Defano.image,
                                    stats: profileData.Defano,
                                })}
                            >
                                <img
                                    src="/images/photo-profil/photo-profil-defa.webp"
                                    alt="Defano"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-lg md:text-xl font-medium mt-3">Defano</div>
                        </div>

                        <div className="relative">
                            <Heart className="w-10 h-10 md:w-14 md:h-14 text-pink-300 animate-pulse" />
                        </div>

                        <div className="relative">
                            <ProfileSnowEffect />
                            <div
                                className="w-24 h-24 md:w-36 md:h-36 overflow-hidden rounded-full border-4 border-white/80 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                                onClick={() => setProfileModal({
                                    isOpen: true,
                                    name: 'Najmita',
                                    profileImage: profileData.Najmita.image,
                                    stats: profileData.Najmita,
                                })}
                            >
                                <img
                                    src="/images/photo-profil/photo-profil-nami.webp"
                                    alt="Najmita"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-lg md:text-xl font-medium mt-3">Najmita</div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-10 space-y-8">
                    {/* Countdown Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Anniversary Card */}
                        <div className={`bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform ${!isMobile && 'hover:-translate-y-1'}`}>
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Calendar className="w-7 h-7 text-white" />
                            </div>
                            <Countdown
                                targetDate={anniversaryDate}
                                label="Menuju Anniversary"
                                delay={1100}
                            />
                        </div>

                        {/* Defano's Birthday Card */}
                        <div
                            className={`bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform ${!isMobile && 'hover:-translate-y-1'} cursor-pointer`}
                            onClick={() => setGiftModal({ isOpen: true, name: 'Defano' })}
                        >
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Gift className="w-7 h-7 text-white" />
                            </div>
                            <Countdown
                                targetDate={defanoBirthday}
                                label="Menuju Ultah Defano"
                                delay={1300}
                            />
                        </div>

                        {/* Najmita's Birthday Card */}
                        <div
                            className={`bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform ${!isMobile && 'hover:-translate-y-1'} cursor-pointer`}
                            onClick={() => setGiftModal({ isOpen: true, name: 'Najmita' })}
                        >
                            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Gift className="w-7 h-7 text-white" />
                            </div>
                            <Countdown
                                targetDate={najmitaBirthday}
                                label="Menuju Ultah Najmita"
                                delay={1500}
                            />
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Notebook Section */}
                        <div className={`bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300`}>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Book className="w-6 h-6 text-amber-500" />
                                    Our Love Notes 💌
                                </h3>
                                <button
                                    onClick={() => setIsNotebookOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto shadow-md hover:shadow-lg"
                                >
                                    Buka Catatan Cinta
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Yuk baca cerita manis kita berdua... 🥰
                            </p>
                        </div>

                        {/* Special Moments */}
                        <div className={`bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300`}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Star className="w-6 h-6 text-purple-500" />
                                Momen Spesial Kita ✨
                            </h3>
                            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="text-sm font-medium text-purple-600">First Date</div>
                                <div className="text-base text-gray-600">27 September 2024</div>
                            </div>
                        </div>
                    </div>

                    {/* Quote Section */}
                    <div className="text-center p-8 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg">
                        <blockquote className="text-lg md:text-xl italic text-gray-700">
                            "Every love story is beautiful, but ours is my favorite"
                            <span className="block mt-2 text-sm text-gray-500">- Our daily reminder 💕</span>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Suspense fallback={
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
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

            <GiftModal
                isOpen={giftModal.isOpen}
                onClose={() => setGiftModal({ isOpen: false, name: '' })}
                name={giftModal.name}
            />

            {profileModal.stats && (
                <ProfileCardModal
                    isOpen={profileModal.isOpen}
                    onClose={() => setProfileModal({ isOpen: false, name: '', profileImage: '', stats: null })}
                    name={profileModal.name}
                    profileImage={profileModal.profileImage}
                    stats={profileModal.stats}
                />
            )}
        </div>
    );
};

export default RelationshipStats;