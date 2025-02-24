import React, { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { Calendar, Gift, Heart, Book, Star, } from 'lucide-react';
import ProfileCardModal from './relationShipUtils/ProfileCardModal';
import GiftModal from './relationShipUtils/GiftModal';
import Countdown from './relationShipUtils/Countdown';
import ProfileSnowEffect from './relationShipUtils/ProfileSnowEffect';
import { ProfileData, ProfileStats } from '../types/types';
import { useIsMobile } from '../hooks/isMobile';
import GlassIcons from './GlassIcons/GlassIcons';

const NotebookModal = lazy(() => import('./modal/NotebookModal'));

interface ProfileModalState {
    isOpen: boolean;
    name: string;
    profileImage: string;
    stats: ProfileStats | null;
}

const RelationshipStats: React.FC = () => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [giftModal, setGiftModal] = useState<{ isOpen: boolean; name: string }>({ isOpen: false, name: '' });
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
            location: 'Tangerang Selatan',
        },
        Najmita: {
            birthday: '17 May',
            zodiac: 'Taurus',
            email: 'najmita@example.com',
            bio: 'Spreading love and happiness everywhere',
            image: '/images/photo-profil/photo-profil-nami.webp',
            location: 'Jakrta Timur',
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

    const anniversaryItems = [
        { icon: <Calendar />, color: 'blue' },
    ];

    const defanoItems = [
        { icon: <Gift />, color: 'purple' },
    ];

    const najmitaItems = [
        { icon: <Gift />, color: 'pink' },
    ];

    const handleGlassIconClick = (name: string) => {
        setGiftModal({ isOpen: true, name });
    };

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
                        <div className={`bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform`}>
                            <div className="w-0 h-0 md:ml-20 ml-6 flex items-center justify-center">
                                <GlassIcons
                                    items={anniversaryItems}
                                    className=''
                                    isModalOpen={giftModal.isOpen && giftModal.name === 'Anniversary'} // Hanya aktif jika name sesuai
                                    onClick={handleGlassIconClick}
                                    name="Anniversary" // Tambahkan name
                                />
                            </div>
                            <Countdown
                                targetDate={anniversaryDate}
                                label="Menuju Anniversary"
                                delay={1100}
                            />
                        </div>

                        {/* Defano's Birthday Card */}
                        <div className={`bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform`}>
                            <div className="w-0 h-0 md:ml-20 ml-6 flex items-center justify-center">
                                <GlassIcons
                                    items={defanoItems}
                                    className=''
                                    isModalOpen={giftModal.isOpen && giftModal.name === 'Defano'} // Hanya aktif jika name sesuai
                                    onClick={handleGlassIconClick}
                                    name="Defano" // Tambahkan name
                                />
                            </div>
                            <Countdown
                                targetDate={defanoBirthday}
                                label="Menuju Ultah Defano"
                                delay={1300}
                            />
                        </div>

                        {/* Najmita's Birthday Card */}
                        <div className={`bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl flex items-center gap-4 shadow-lg ${!isMobile && 'hover:shadow-xl'} transition-all duration-300 transform`}>
                            <div className="w-0 h-0 md:ml-20 ml-6 flex items-center justify-center">
                                <GlassIcons
                                    items={najmitaItems}
                                    className=''
                                    isModalOpen={giftModal.isOpen && giftModal.name === 'Najmita'} // Hanya aktif jika name sesuai
                                    onClick={handleGlassIconClick}
                                    name="Najmita" // Tambahkan name
                                />
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