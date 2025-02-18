import React from 'react';
import { ArrowLeft, Camera, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MemoryGalleryAll from '../components/MemoryGalleryAll';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';

const MemoriesPage: React.FC = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Using your isMobile function here

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const handleGoBack = () => {
        navigate('/')
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
        >
            <div className={`sticky top-0 z-20 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
                }`}>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 
                             transition-all duration-300 ease-out 
                             bg-white/80 hover:bg-blue-50 
                             px-4 py-2 rounded-xl shadow-sm hover:shadow-md
                             focus:outline-none focus:ring-2 focus:ring-blue-200"
                            onClick={handleGoBack}>
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline font-medium">Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <Camera className="w-7 h-7 text-blue-600 animate-pulse" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
                                My Memories
                            </h1>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto md:px-4 md:py-2 px-2 py-1">
                <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-0 overflow-hidden">
                    <CardContent className="md:p-8 p-4">
                        <div className="max-w-5xl mx-auto text-center space-y-4">
                            <h2 className="md:text-2xl text-lg font-bold mb-4">Kisah Kita, Momen Kita</h2>
                            <p className="text-blue-50 md:text-sm text-xs">
                            Setiap foto itu kayak tangkapan dari momen yang udah pergi, yang nggak bakal bisa balik lagi. Dia menangkap sesuatu yang cuma terjadi sekali, dan meskipun waktu terus berjalan, kenangan itu tetap hidup di dalam gambar. Sebuah kenangan yang nggak bisa diulang, tapi selalu ada di sana, abadi dalam setiap jepretan. Inilah kisah kita, Defano dan Najmita, yang terukir dalam setiap detik yang kita lewati bersama, meski waktu takkan pernah kembali.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <MemoryGalleryAll />
            </main>

            <motion.footer
                className="mt-12 py-6 bg-gray-50 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
                    Hargai setiap momen, abadikan kenangan indah
                </div>
            </motion.footer>
        </motion.div>
    );
};

export default MemoriesPage;