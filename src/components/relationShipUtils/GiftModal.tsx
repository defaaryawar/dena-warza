import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

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

export default GiftModal;