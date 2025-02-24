import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Star, Heart, MapPin, X, MessageCircle, Share2 } from 'lucide-react';
import { ProfileStats } from '../../types/types';

interface ProfileCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    profileImage: string;
    stats: ProfileStats;
}

const ProfileCardModal: React.FC<ProfileCardModalProps> = ({ isOpen, onClose, name, profileImage, stats }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Function to open WhatsApp with the appropriate phone number
    const handleMessageClick = () => {
        let phoneNumber;
        
        // Determine which phone number to use based on the name
        if (name.toLowerCase().includes('defano')) {
            phoneNumber = '081219147116';
        } else if (name.toLowerCase().includes('najmita')) {
            phoneNumber = '+62 858-9321-1201';
        } else {
            // Default case or fallback
            phoneNumber = '081219147116';
        }
        
        // Format the phone number by removing spaces
        const formattedPhone = phoneNumber.replace(/\s/g, '');
        
        // Open WhatsApp web with the phone number
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    // Function to share the profile information
    const handleShareClick = () => {
        // Create a formatted text with the profile data
        const shareText = `
🌟 *${name}'s Profile* 🌟

📝 "${stats.bio}"

🎂 Birthday: ${stats.birthday}
⭐ Zodiac: ${stats.zodiac}
💖 Status: In Love 💑
📍 Location: ${stats.location || "Jakarta"}

Share this profile to connect!
        `;

        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: `${name}'s Profile`,
                text: shareText
            }).catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    alert('Profile information copied to clipboard!');
                })
                .catch(() => {
                    alert('Could not copy to clipboard. Please try another sharing method.');
                });
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-995 p-4"
                onClick={handleBackdropClick}
            >
                <motion.div
                    className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl"
                >
                    {/* Top blurred image section - REDUCED HEIGHT */}
                    <div className="relative md:h-60 h-56 overflow-hidden">
                        {/* Blurred background version of profile image */}
                        <div
                            className="absolute inset-0 scale-110 z-0"
                            style={{
                                backgroundImage: `url(${profileImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(5px) brightness(0.7)'
                            }}
                        />

                        {/* Glass morphism top bar */}
                        <div className="absolute top-0 inset-x-0 h-12 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-4 z-20">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                                <span className="text-white/90 text-xs font-medium">Profile</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Profile image with ring effect - SMALLER SIZE */}
                        <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-1 animate-spin-slow"></div>
                                <div className="w-28 h-28 rounded-full border-3 border-white shadow-xl overflow-hidden relative">
                                    <img
                                        src={profileImage}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>

                            {/* Name badge - SMALLER TEXT */}
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-2 text-center"
                            >
                                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full inline-block">
                                    <h3 className="text-base font-bold text-white drop-shadow-md">{name}</h3>
                                </div>
                            </motion.div>
                        </div>

                        {/* Wave divider */}
                        <div className="absolute -bottom-2 inset-x-0 z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                                <path fill="white" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Content section - REDUCED PADDING */}
                    <div className="px-4 md:pt-2 pt-4 pb-4 relative z-30 bg-white">
                        {/* Profile actions - MOVED UP AND SMALLER */}
                        <div className="flex justify-center -mt-10 mb-4 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors"
                                onClick={handleMessageClick}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
                                onClick={handleShareClick}
                            >
                                <Share2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Bio quote - CONDENSED */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-inner mb-4 max-h-20 overflow-auto">
                            <div className="relative">
                                <span className="absolute -top-2 -left-1 text-2xl text-pink-300">"</span>
                                <p className="text-gray-600 text-xs italic text-center px-2">{stats.bio}</p>
                                <span className="absolute -bottom-2 -right-1 text-2xl text-pink-300">"</span>
                            </div>
                        </div>

                        {/* Stats grid - MORE COMPACT */}
                        <div className="grid grid-cols-2 gap-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-purple-50 to-purple-100 p-2.5 rounded-xl border border-purple-100"
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-purple-500 rounded-lg">
                                        <Calendar className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-purple-700">Birthday</span>
                                </div>
                                <p className="mt-1 text-gray-700 text-xs font-medium">{stats.birthday}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-pink-50 to-pink-100 p-2.5 rounded-xl border border-pink-100"
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-pink-500 rounded-lg">
                                        <Star className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-pink-700">Zodiac</span>
                                </div>
                                <p className="mt-1 text-gray-700 text-xs font-medium">{stats.zodiac}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-xl border border-blue-100"
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-blue-500 rounded-lg">
                                        <Heart className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-blue-700">Status</span>
                                </div>
                                <p className="mt-1 text-gray-700 text-xs font-medium">In Love 💑</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-br from-green-50 to-green-100 p-2.5 rounded-xl border border-green-100"
                            >
                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-green-500 rounded-lg">
                                        <MapPin className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-green-700">Location</span>
                                </div>
                                <p className="mt-1 text-gray-700 text-xs font-medium">{stats.location || "Jakarta"}</p>
                            </motion.div>
                        </div>

                        {/* Call to action button - SMALLER */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                        >
                            <span className="relative inline-block">
                                <span className="relative z-10">More About {name.split(' ')[0]}</span>
                                <span className="absolute inset-0 animate-pulse bg-white/20 rounded-full blur-sm"></span>
                            </span>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileCardModal;