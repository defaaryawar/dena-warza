import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, SparklesIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";

const isLoveConfessionValid = () => {
    const lastConfession = localStorage.getItem('lastLoveConfession'); // Changed to localStorage
    if (!lastConfession) return false;
    const lastDate = new Date(lastConfession);
    const today = new Date();
    return lastDate.toDateString() === today.toDateString();
};

const saveLoveConfession = () => {
    localStorage.setItem('pendingConfession', 'true');
    localStorage.setItem('confessionStartTime', new Date().toISOString());
};

const completeLoveConfession = () => {
    localStorage.removeItem('pendingConfession');
    localStorage.setItem('lastLoveConfession', new Date().toISOString());
};

const LovePopup = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [hasConfessed, setHasConfessed] = useState(isLoveConfessionValid());
    const [isPending, setIsPending] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check for pending confession on component mount and window focus
        const checkPendingConfession = () => {
            const pending = localStorage.getItem('pendingConfession');
            const startTime = localStorage.getItem('confessionStartTime');

            if (pending && startTime) {
                const start = new Date(startTime);
                const now = new Date();
                const timeElapsed = now.getTime() - start.getTime();

                // If more than 30 seconds have passed since WhatsApp was opened
                if (timeElapsed > 30000) {
                    completeLoveConfession();
                    setHasConfessed(true);
                    setIsOpen(false);
                    setIsPending(false);
                } else {
                    setIsPending(true);
                    setIsOpen(true);
                }
            }
        };

        checkPendingConfession();
        window.addEventListener('focus', checkPendingConfession);

        return () => {
            window.removeEventListener('focus', checkPendingConfession);
        };
    }, []);

    useEffect(() => {
        setHasConfessed(isLoveConfessionValid());
        if (isOpen && !hasConfessed) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [location, isOpen, hasConfessed]);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("iloveeyouuumoreeee sayangkuuu gantengkuu cintakuuu 💖💝💕");
        const whatsappUrl = `https://wa.me/6281219147116?text=${message}`;
        saveLoveConfession();
        setIsPending(true);
        window.open(whatsappUrl, '_blank');
    };

    if (!isOpen || hasConfessed) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[995] flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    className="relative max-w-2xl w-full mx-4 min-h-[500px] bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 rounded-[40px] shadow-2xl overflow-hidden border-8 border-white/20"
                >
                    {/* Previous decorative elements remain the same */}
                    {/* ... */}

                    <div className="relative p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <motion.div
                                className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6"
                                whileHover={{ scale: 1.05 }}
                            >
                                ✨ Special Message ✨
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
                                {isPending ? "Jangan Tutup WhatsApp Ya!" : "Tunggu Sebentar Ya"}
                                <br />
                                Sayang! 💝
                            </h2>

                            <motion.p
                                className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {isPending ? (
                                    <>
                                        Pastikan kamu kirim pesannya dulu ya sayang...
                                        <br />
                                        <span className="text-pink-500 font-medium">Popup akan hilang setelah pesan terkirim! 🥰</span>
                                    </>
                                ) : (
                                    <>
                                        Kamu belum bilang "I love you more" ke si ganteng hari ini...
                                        <br />
                                        <span className="text-pink-500 font-medium">Yuk bilang dulu biar bisa lanjut! 🥰</span>
                                    </>
                                )}
                            </motion.p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative group w-full max-w-md cursor-pointer py-6 px-8 rounded-2xl bg-gradient-to-r ${isPending ? 'from-gray-400 to-gray-500' : 'from-green-500 to-emerald-600'
                                } text-white font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-4 hover:shadow-xl transition-all duration-300 overflow-hidden`}
                            onClick={handleWhatsAppClick}
                            disabled={isPending}
                        >
                            <RiWhatsappFill className="relative w-8 h-8" />
                            <span className="relative">
                                {isPending ? "Tunggu sebentar ya..." : "Chat Pacarmuu itu ya sayang, Sekarang!"}
                            </span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-gray-500 text-sm">
                                💕 {isPending ? "Pastikan pesannya terkirim ya sayang..." : "Kirim pesan manis ke WhatsApp pacarmu yang ganteng"} 💕
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LovePopup;