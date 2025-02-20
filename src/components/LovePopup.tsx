import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, SparklesIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";

const isLoveConfessionValid = () => {
    const lastConfession = localStorage.getItem('lastLoveConfession');
    if (!lastConfession) return false;
    const lastDate = new Date(lastConfession);
    const today = new Date();
    return lastDate.toDateString() === today.toDateString();
};

const saveLoveConfession = () => {
    localStorage.setItem('lastLoveConfession', new Date().toISOString());
};

const LovePopup = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [hasConfessed, setHasConfessed] = useState(isLoveConfessionValid());
    const [isPending, setIsPending] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setHasConfessed(isLoveConfessionValid());
    }, []); // Hanya dijalankan sekali saat komponen mount

    useEffect(() => {
        if (isOpen && !hasConfessed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, hasConfessed]);

    const handleSendMessage = async () => {
        const message = "iloveeyouuumoreeee sayangkuuu gantengkuu cintakuuu 💖💝💕";

        try {
            setIsPending(true);

            // Debug: Log URL API dan request body
            console.log("Mengirim request ke:", `${import.meta.env.VITE_API_BASE_URL}/api/messages/send`);
            console.log("Request body:", JSON.stringify({ message }));

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            // Debug: Log response dari backend
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error(data.message || "Gagal mengirim pesan");
            }

            saveLoveConfession();
            setHasConfessed(true);
            setIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
            alert(error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi nanti.");
        } finally {
            setIsPending(false);
        }
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
                                Kirim Pesan Cinta ke Defano 💝
                            </h2>

                            <motion.p
                                className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Yuk kirim pesan cinta ke Defano sekarang juga!
                                <br />
                                <span className="text-pink-500 font-medium">Pesan akan dikirim otomatis ke WhatsApp Defano! 🥰</span>
                            </motion.p>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative group w-full max-w-md cursor-pointer py-6 px-8 rounded-2xl bg-gradient-to-r ${isPending ? 'from-gray-400 to-gray-500' : 'from-green-500 to-emerald-600'
                                } text-white font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-4 hover:shadow-xl transition-all duration-300 overflow-hidden`}
                            onClick={handleSendMessage}
                            disabled={isPending}
                        >
                            <RiWhatsappFill className="relative w-8 h-8" />
                            <span className="relative">
                                {isPending ? "Mengirim pesan..." : "Kirim Pesan ke Defano Sekarang!"}
                            </span>
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LovePopup;