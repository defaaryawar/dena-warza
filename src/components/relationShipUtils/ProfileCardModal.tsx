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

    const handleMessageClick = () => {
        let phoneNumber;
        if (name.toLowerCase().includes('defano')) {
            phoneNumber = '081219147116';
        } else if (name.toLowerCase().includes('najmita')) {
            phoneNumber = '+62 858-9321-1201';
        } else {
            phoneNumber = '081219147116';
        }
        const formattedPhone = phoneNumber.replace(/\s/g, '');
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const handleShareClick = () => {
        const shareText = `
🌟 *${name}'s Profile* 🌟

📝 "${stats.bio}"

🎂 Birthday: ${stats.birthday}
⭐ Zodiac: ${stats.zodiac}
💖 Status: In Love 💑
📍 Location: ${stats.location || "Jakarta"}

Share this profile to connect!
        `;

        if (navigator.share) {
            navigator.share({
                title: `${name}'s Profile`,
                text: shareText
            }).catch(error => console.log('Error sharing:', error));
        } else {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    alert('Profile information copied to clipboard!');
                })
                .catch(() => {
                    alert('Could not copy to clipboard. Please try another sharing method.');
                });
        }
    };

    // Variasi animasi untuk elemen-elemen dalam modal
    const containerVariants = {
        hidden: { 
            scale: 0.8, 
            opacity: 0, 
            rotate: -5,
            y: 50
        },
        visible: { 
            scale: 1, 
            opacity: 1, 
            rotate: 0,
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth elastic feel
                staggerChildren: 0.07,
                delayChildren: 0.2
            }
        },
        exit: { 
            scale: 0.9, 
            opacity: 0, 
            rotate: 3,
            y: -30,
            transition: { 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const backdropVariants = {
        hidden: { 
            opacity: 0, 
            backdropFilter: 'blur(0px)',
            backgroundColor: 'rgba(0, 0, 0, 0)' 
        },
        visible: { 
            opacity: 1, 
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            transition: { 
                duration: 0.7, 
                ease: 'easeInOut' 
            }
        },
        exit: { 
            opacity: 0, 
            backdropFilter: 'blur(0px)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            transition: { 
                duration: 0.5, 
                ease: 'easeInOut',
                delay: 0.1
            }
        }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="backdrop"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-995 p-4 perspective"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        key="modal"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl will-change-transform"
                        style={{
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        }}
                    >
                        {/* Top blurred image section */}
                        <motion.div 
                            className="relative md:h-60 h-56 overflow-hidden"
                            variants={childVariants}
                        >
                            <motion.div
                                className="absolute inset-0 scale-110 z-0"
                                initial={{ scale: 1.3, filter: "blur(10px) brightness(0.5)" }}
                                animate={{ 
                                    scale: 1.1, 
                                    filter: "blur(5px) brightness(0.7)",
                                    transition: { duration: 1, ease: "easeOut" }
                                }}
                                style={{
                                    backgroundImage: `url(${profileImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />

                            {/* Glass morphism top bar */}
                            <motion.div 
                                className="absolute top-0 inset-x-0 h-12 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-4 z-20"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: 0.3, duration: 0.4 }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <motion.div 
                                        className="w-2 h-2 rounded-full bg-purple-400"
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    ></motion.div>
                                    <span className="text-white/90 text-xs font-medium">Profile</span>
                                </div>
                                <motion.button
                                    onClick={onClose}
                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-4 h-4 text-white" />
                                </motion.button>
                            </motion.div>

                            {/* Profile image with ring effect */}
                            <motion.div 
                                className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        delay: 0.4, 
                                        duration: 0.6,
                                        type: "spring",
                                        stiffness: 200
                                    }
                                }}
                            >
                                <div className="relative">
                                    <motion.div 
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-1"
                                        animate={{ 
                                            rotate: 360,
                                            transition: { 
                                                duration: 8, 
                                                ease: "linear", 
                                                repeat: Infinity 
                                            }
                                        }}
                                    ></motion.div>
                                    <motion.div 
                                        className="w-28 h-28 rounded-full border-3 border-white shadow-xl overflow-hidden relative"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.img
                                            src={profileImage}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                            initial={{ scale: 1.2 }}
                                            animate={{ 
                                                scale: 1,
                                                transition: { delay: 0.5, duration: 0.8 }
                                            }}
                                        />
                                        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </motion.div>
                                </div>

                                {/* Name badge */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="mt-2 text-center"
                                >
                                    <motion.div 
                                        className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full inline-block"
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                                    >
                                        <h3 className="text-base font-bold text-white drop-shadow-md">{name}</h3>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Wave divider with animation */}
                            <motion.div 
                                className="absolute -bottom-2 inset-x-0 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: 0.3, duration: 0.6 }
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                                    <motion.path 
                                        fill="white" 
                                        fillOpacity="1" 
                                        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ 
                                            pathLength: 1, 
                                            opacity: 1,
                                            transition: { 
                                                delay: 0.4, 
                                                duration: 1, 
                                                ease: "easeInOut" 
                                            }
                                        }}
                                    ></motion.path>
                                </svg>
                            </motion.div>
                        </motion.div>

                        {/* Content section */}
                        <motion.div 
                            className="px-4 md:pt-2 pt-4 pb-4 relative z-30 bg-white"
                            variants={childVariants}
                        >
                            {/* Profile actions */}
                            <div className="flex justify-center -mt-10 mb-4 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)" }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors"
                                    onClick={handleMessageClick}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                        scale: 1, 
                                        opacity: 1,
                                        transition: { 
                                            delay: 0.8, 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10
                                        }
                                    }}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
                                    onClick={handleShareClick}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                        scale: 1, 
                                        opacity: 1,
                                        transition: { 
                                            delay: 0.9, 
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10
                                        }
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Bio quote */}
                            <motion.div 
                                className="bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-inner mb-4 max-h-20 overflow-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        delay: 0.5, 
                                        duration: 0.5
                                    }
                                }}
                            >
                                <div className="relative">
                                    <motion.span 
                                        className="absolute -top-2 -left-1 text-2xl text-pink-300"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ 
                                            opacity: 1, 
                                            x: 0,
                                            transition: { delay: 0.7 }
                                        }}
                                    >"</motion.span>
                                    <p className="text-gray-600 text-xs italic text-center px-2">{stats.bio}</p>
                                    <motion.span 
                                        className="absolute -bottom-2 -right-1 text-2xl text-pink-300"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ 
                                            opacity: 1, 
                                            x: 0,
                                            transition: { delay: 0.7 }
                                        }}
                                    >"</motion.span>
                                </div>
                            </motion.div>

                            {/* Stats grid with staggered animation */}
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    {
                                        icon: <Calendar className="w-3 h-3 text-white" />,
                                        title: "Birthday",
                                        value: stats.birthday,
                                        bg: "from-purple-50 to-purple-100",
                                        iconBg: "bg-purple-500",
                                        textColor: "text-purple-700",
                                        border: "border-purple-100",
                                        delay: 0.55
                                    },
                                    {
                                        icon: <Star className="w-3 h-3 text-white" />,
                                        title: "Zodiac",
                                        value: stats.zodiac,
                                        bg: "from-pink-50 to-pink-100",
                                        iconBg: "bg-pink-500",
                                        textColor: "text-pink-700",
                                        border: "border-pink-100",
                                        delay: 0.65
                                    },
                                    {
                                        icon: <Heart className="w-3 h-3 text-white" />,
                                        title: "Status",
                                        value: "In Love 💑",
                                        bg: "from-blue-50 to-blue-100",
                                        iconBg: "bg-blue-500",
                                        textColor: "text-blue-700",
                                        border: "border-blue-100",
                                        delay: 0.75
                                    },
                                    {
                                        icon: <MapPin className="w-3 h-3 text-white" />,
                                        title: "Location",
                                        value: stats.location || "Jakarta",
                                        bg: "from-green-50 to-green-100",
                                        iconBg: "bg-green-500",
                                        textColor: "text-green-700",
                                        border: "border-green-100",
                                        delay: 0.85
                                    }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20, x: index % 2 === 0 ? -5 : 5 }}
                                        animate={{ 
                                            opacity: 1, 
                                            y: 0, 
                                            x: 0,
                                            transition: { 
                                                delay: stat.delay, 
                                                duration: 0.5,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 15
                                            }
                                        }}
                                        whileHover={{ 
                                            scale: 1.03, 
                                            transition: { duration: 0.2 }
                                        }}
                                        className={`bg-gradient-to-br ${stat.bg} p-2.5 rounded-xl border ${stat.border}`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <motion.div 
                                                className={`p-1.5 ${stat.iconBg} rounded-lg`}
                                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {stat.icon}
                                            </motion.div>
                                            <span className={`text-xs font-semibold ${stat.textColor}`}>{stat.title}</span>
                                        </div>
                                        <p className="mt-1 text-gray-700 text-xs font-medium">{stat.value}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Call to action button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        delay: 0.95, 
                                        duration: 0.5,
                                        type: "spring"
                                    }
                                }}
                                whileHover={{ 
                                    scale: 1.03, 
                                    boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all overflow-hidden relative"
                            >
                                <motion.span 
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"
                                    animate={{ 
                                        x: ["0%", "100%", "0%"],
                                        transition: { 
                                            duration: 3, 
                                            ease: "linear", 
                                            repeat: Infinity 
                                        }
                                    }}
                                    style={{ opacity: 0.3 }}
                                ></motion.span>
                                <span className="relative z-10">More About {name.split(' ')[0]}</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileCardModal;