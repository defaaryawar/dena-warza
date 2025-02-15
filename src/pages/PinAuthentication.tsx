import { useState, useCallback, memo, useEffect } from 'react';
import { Check, Delete, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

// Komponen Galeri Foto Romantis
const PhotoGallery = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Array foto Anda - ganti dengan path foto Anda
    const photos = [
        { url: '/images/ngedate/bioskop-date/bioskop-date4.webp', caption: 'Bioskop Date 🎬' },
        { url: '/images/ngedate/cafe-date/cafe-date.webp', caption: 'Coffee Shop ☕' },
        { url: '/images/ngedate/first-date/first-date.webp', caption: 'First Date ❤️' },
        { url: '/images/ngedate/jalan-jalan-date/jalan-jalan-date3.webp', caption: 'Jalan-jalan Sore 🚶‍♂️' },
        { url: '/images/ngedate/kopi-kembali-ke-alam-date/kopi-kembali-ke-alam-date8.webp', caption: 'Kopi Kembali ke Alam 🌿' },
        { url: '/images/ngedate/mall-date/mall-date.webp', caption: 'Mall Date 🛍️' },
        { url: '/images/ngedate/mini-market-date/mini-market-date.webp', caption: 'Mini Market with Ayang 🛒' },
        { url: '/images/ngedate/nako-date/nako-date8.webp', caption: 'Kopi Nako Bogor 🍵' },
        { url: '/images/ngedate/pantai-date/pantai-date.webp', caption: 'Pantai Date 🌊' },
        { url: '/images/ngedate/pecel-lele-date/pecel-lele-date.webp', caption: 'Pecel Lele 🍛' },
        { url: '/images/ngedate/photo-both/photo-both2.webp', caption: 'Photo Booth 📸' },
        { url: '/images/ngedate/ragunan-date/ragunan-date2.webp', caption: 'Ragunan 🦁' },
        { url: '/images/ngedate/roti-buaya-date/roti-buaya-date3.webp', caption: 'Roti Buaya 🐊' },
        { url: '/images/ngedate/wisudaan/wisudaan.webp', caption: 'Wisuda 🎓' },
    ];

    // Auto rotate photos
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % photos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered, photos.length]);

    return (
        <div
            className="relative w-full h-full overflow-hidden rounded-l-2xl bg-gradient-to-br from-pink-900 to-purple-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Floating Hearts Animation */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            y: '100%',
                            x: Math.random() * 100 + '%',
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0.3
                        }}
                        animate={{
                            y: '-100%',
                            opacity: [0.3, 0.8, 0.3],
                            x: `${Math.sin(Math.random() * Math.PI) * 20 + parseInt((Math.random() * 100).toString())}%`
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        className="absolute text-pink-200"
                    >
                        <Heart size={16} />
                    </motion.div>
                ))}
            </div>

            {/* Main Photo Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={photos[activeIndex].url}
                        alt={photos[activeIndex].caption}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Caption */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-8 left-0 right-0 text-center"
                    >
                        <p className="text-white text-lg font-medium px-4 py-2 bg-black/30 backdrop-blur-sm inline-block rounded-full">
                            {photos[activeIndex].caption}
                        </p>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Photo Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {photos.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all cursor-pointer duration-300 ${index === activeIndex
                            ? 'w-6 h-2 bg-white rounded-full'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75 rounded-full'
                            }`}
                    />
                ))}
            </div>

            {/* Hover Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.5 : 0 }} // Mengurangi opacity overlay hover
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none"
            >
                <p className="text-white text-xl font-medium">Our Beautiful Moments ❤️</p>
            </motion.div>
        </div>
    );
});

// NumPad Component
const NumPad = memo(({ onNumClick, onBackspace, disabled }: {
    onNumClick: (num: string) => void;
    onBackspace: () => void;
    disabled: boolean;
}) => {
    const numPadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
            {numPadButtons.map((btn, index) => {
                if (btn === '') return <div key={index} />;

                if (btn === 'del') {
                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBackspace}
                            disabled={disabled}
                            className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex items-center justify-center 
                       disabled:opacity-50 transition-colors group"
                        >
                            <Delete className="w-6 h-6 text-gray-600 group-hover:text-red-500" />
                        </motion.button>
                    );
                }

                return (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNumClick(btn)}
                        disabled={disabled}
                        className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-pink-50 
                     rounded-lg p-3 text-xl font-semibold text-gray-800 
                     transition-colors hover:border-pink-300 disabled:opacity-50
                     focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        {btn}
                    </motion.button>
                );
            })}
        </div>
    );
});

// PIN Dots Component
const PinDots = memo(({ length }: { length: number }) => (
    <div className="flex justify-center space-x-3">
        {Array(6).fill(0).map((_, index) => (
            <motion.div
                key={index}
                initial={false}
                animate={{
                    scale: index < length ? 1.1 : 1,
                    backgroundColor: index < length ? '#EC4899' : '#D1D5DB'
                }}
                className="w-3 h-3 rounded-full"
            />
        ))}
    </div>
));

// Status Alert Component
const StatusAlert = memo(({ type, message, onClose }: {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); // Alert akan hilang setelah 2 detik
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
            <Alert
                className={`${type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    } shadow-lg min-w-[320px] backdrop-blur-sm`}
            >
                <div className={`${type === 'success' ? 'text-green-800' : 'text-red-800'
                    } flex items-center justify-between`}>
                    <AlertDescription>
                        {message}
                    </AlertDescription>
                    <button onClick={onClose} className="ml-2 text-sm hover:opacity-70">✕</button>
                </div>
            </Alert>
        </motion.div>
    );
});

// Main PinAuthentication Component
const PinAuthentication = () => {
    const [pin, setPin] = useState('');
    const [status, setStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string | null;
    }>({ type: null, message: null });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNumClick = useCallback((num: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
        }
    }, [pin.length]);

    const handleBackspace = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    const handlePinSubmit = async () => {
        if (pin.length !== 6 || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/authenticate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Autentikasi berhasil! Mengalihkan...'
                });
                sessionStorage.setItem('authToken', data.token);

                // Konfeti dengan bentuk hati
                const confetti = (await import('canvas-confetti')).default;
                const count = 200;
                const defaults = {
                    origin: { y: 0.7 }
                };

                function fire(particleRatio: number, opts: Record<string, number>) {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio),
                        scalar: 1.2,
                    });
                }

                fire(0.25, {
                    spread: 26,
                    startVelocity: 55,
                    scalar: 1.2
                });

                fire(0.2, {
                    spread: 60,
                    scalar: 1.2
                });

                fire(0.35, {
                    spread: 100,
                    decay: 0.91,
                    scalar: 0.8
                });

                fire(0.1, {
                    spread: 120,
                    startVelocity: 25,
                    decay: 0.92,
                    scalar: 1.2
                });

                fire(0.1, {
                    spread: 120,
                    startVelocity: 45,
                    scalar: 1.2
                });

                // Gunakan replace: true untuk menghapus halaman PIN dari history
                setTimeout(() => navigate('/', { replace: true }), 2000);
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'PIN salah. Silakan coba lagi.'
                });
                setPin('');
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Terjadi kesalahan. Silakan coba lagi.'
            });
            setPin('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <AnimatePresence>
                {status.type && (
                    <StatusAlert
                        type={status.type}
                        message={status.message!}
                        onClose={() => setStatus({ type: null, message: null })}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl flex overflow-hidden"
            >
                {/* Photo Gallery Section */}
                <div className="hidden md:block md:w-1/2 h-[602px]">
                    <PhotoGallery />
                </div>

                {/* PIN Input Section */}
                <div className="w-full md:w-1/2 p-8 space-y-8 flex flex-col justify-center 
                      bg-white bg-opacity-90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -10, 10, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <Heart className="mx-auto w-12 h-12 text-pink-500 fill-pink-500" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                        <p className="text-sm text-gray-600">Enter your 6-digit PIN</p>
                    </motion.div>

                    <PinDots length={pin.length} />

                    <NumPad
                        onNumClick={handleNumClick}
                        onBackspace={handleBackspace}
                        disabled={isLoading}
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePinSubmit}
                        disabled={pin.length !== 6 || isLoading}
                        className={`w-full py-3 rounded-lg text-white font-semibold 
                      transition-colors flex items-center justify-center
                      ${pin.length === 6 && !isLoading
                                ? 'bg-pink-500 hover:bg-pink-600'
                                : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : status.type === 'success' ? (
                            <Check className="w-6 h-6" />
                        ) : (
                            'Verify PIN'
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default PinAuthentication;