import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EnhancedLyricsPage = () => {
    // Core states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
    const [songEnded, setSongEnded] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // New feature states
    const [showLoveMessage, setShowLoveMessage] = useState(false);
    const [showGift, setShowGift] = useState(false);
    const [loveMessageIndex, setLoveMessageIndex] = useState(0);
    const [heartBurst, setHeartBurst] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Love messages collection
    const loveMessages = [
        "Cantik, kamu tuh kayak TikTok viral—nggak ada bosennya aku liat terus! 😍",
        "Mbul, jujur aja nih, aku tuh kadang gelagapan kalo ngobrol sama kamu. Gara-gara apa? Gara-gara kamu too good to be true! 😳❤️",
        "Cantik, kamu tuh kayak WiFi—tanpa kamu, hidupku langsung nggak ada sinyal. Always need you! 📶💘",
        "Mbul, serius deh, kalo kamu jadi meme, pasti aku yang paling sering save & forward. Kamu itu legendary! 😂🔥",
        "Cantik, aku nggak janji romantis kayak drakor, tapi aku bisa janji bakal bikin kamu ketawa terus. Deal? 😘",
        "Mbul, kamu tuh kayak kopi favorit—bikin melek, bikin semangat, dan bikin aku addicted. Gawat kan? ☕💖",
        "Cantik, kalo kamu jadi Spotify, aku mau jadi playlist-nya biar bisa nemenin kamu 24/7. 🎵✨",
        "Mbul, kamu tuh kayak Google—setiap ada kamu, semua pertanyaan hidupku langsung ada jawabannya. ❤️",
        "Cantik, aku nggak minta banyak, kok. Cuma mau jadi pacar yang bikin kamu senyum-senyum sendiri kayak aku. 😏💕",
        "Mbul, jangan sering-sering bikin aku kagum gini deh... Ntar aku makin susah move on dari kamu. 😭💘"
    ];

    // Enhanced lyrics with more precise word timing (in milliseconds)
    const lyrics = [
        {
            text: "Untuk Najmita Zahira Dirgantoro ❤️",
            time: 0,
        },
        {
            text: "Kar'na kamu cantik",
            time: 3.5,
            wordTimings: [1000, 2200, 3000]
        },
        {
            text: "'Kan kuberi s'galanya apa yang kupunya",
            time: 6.5,
            wordTimings: [700, 1300, 3300, 4000, 4200, 4600]
        },
        {
            text: "Dan hatimu baik",
            time: 11,
            wordTimings: [700, 1600, 2200]
        },
        {
            text: "Sempurnalah duniaku saat kau di sisiku",
            time: 13.4,
            wordTimings: [3000, 4900, 5700, 5750, 5800, 5802, 5805]
        },
        {
            text: "Bukan kar'na make up di wajahmu",
            time: 18.5,
            wordTimings: [400, 1300, 1800, 1801, 1802, 3000]
        },
        {
            text: "Atau lipstik merah itu (di bibirmu)",
            time: 22,
            wordTimings: [600, 1000, 2400, 3000, 4000, 4001]
        },
        {
            text: "Lembut hati tutur kata",
            time: 25.5,
            wordTimings: [700, 1500, 2000, 2500]
        },
        {
            text: "Terciptalah cinta yang kupuja",
            time: 28,
            wordTimings: [700, 3300, 3600, 4100]
        },
    ];

    // State for character animation
    const [visibleChars, setVisibleChars] = useState(0);
    const animationSpeed = 60; // milliseconds per character

    // Refs to store active timers
    const animationTimers = useRef<NodeJS.Timeout[]>([]);

    // Confetti animation
    const generateConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    // Toggle love message modal
    const toggleLoveMessage = () => {
        if (!showLoveMessage) {
            setLoveMessageIndex((prev) => (prev + 1) % loveMessages.length);
            setHeartBurst(true);
            setTimeout(() => setHeartBurst(false), 1000);
        }
        setShowLoveMessage(!showLoveMessage);
    };

    // Toggle gift modal
    const toggleGift = () => {
        setShowGift(!showGift);
        if (!showGift) {
            generateConfetti();
        }
    };

    // Handler for user interaction
    const handleUserInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
            playAudio();
        }
    };

    // Function to play audio
    // Contoh perbaikan untuk fungsi playAudio
    const playAudio = () => {
        if (!audioRef.current) return;

        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((error) => {
                console.error("Playback failed:", error);
                setIsPlaying(false);
            });
    };

    // Handler for play button
    const handlePlay = () => {
        playAudio();
    };

    // Handler for pause button
    // Contoh perbaikan untuk handlePause
    const handlePause = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };

    // Handler for repeat button
    const handleRepeat = () => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = 0;
        audioRef.current.play()
            .then(() => {
                setIsPlaying(true);
                setSongEnded(false);
                setCurrentLyricIndex(0);
                setVisibleChars(0);
            })
            .catch((error: any) => console.error("Repeat failed:", error));
    };

    // Update current lyric based on time and animate characters smoothly
    useEffect(() => {
        const updateLyric = () => {
            if (!audioRef.current) return;

            const currentTime = audioRef.current.currentTime;

            // Find lyric that matches current time
            for (let i = lyrics.length - 1; i >= 0; i--) {
                if (currentTime >= lyrics[i].time) {
                    if (currentLyricIndex !== i) {
                        setCurrentLyricIndex(i);
                        setVisibleChars(0);

                        // Clear all active timers
                        animationTimers.current.forEach(timer => clearTimeout(timer));
                        animationTimers.current = [];

                        const currentLyric = lyrics[i].text;
                        const totalChars = currentLyric.length;

                        // Calculate total animation duration based on lyric length
                        const wordTimings = lyrics[i].wordTimings ?? [];
                        const totalDuration = wordTimings.length > 0 ? Math.max(...wordTimings) : Math.min(2500, totalChars * animationSpeed);

                        // Calculate delay between character reveals for smooth effect
                        const charDelay = totalDuration / totalChars;

                        // Set up smooth character animation with progressive delays
                        for (let charIndex = 0; charIndex < totalChars; charIndex++) {
                            const timer = setTimeout(() => {
                                setVisibleChars(charIndex + 1);
                            }, charIndex * charDelay);

                            animationTimers.current.push(timer);
                        }
                    }
                    break;
                }
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setSongEnded(true);
        };

        if (isPlaying && audioRef.current) {
            const interval = setInterval(updateLyric, 100);
            audioRef.current.addEventListener('ended', handleEnded);

            return () => {
                clearInterval(interval);
                if (audioRef.current) {
                    audioRef.current.removeEventListener('ended', handleEnded);
                }
            };
        }
    }, [isPlaying, lyrics, currentLyricIndex, animationSpeed]);

    // Cleanup timers when component unmounts
    useEffect(() => {
        return () => {
            animationTimers.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    // Render lyrics with smooth character animation
    const renderLyric = () => {
        if (currentLyricIndex < 0) return null;

        const text = lyrics[currentLyricIndex].text;

        // Smooth character animation
        return (
            <p className="text-xl md:text-2xl lg:text-3xl tracking-wide font-medium font-display">
                <span className="text-pink-300 transition-all duration-300">
                    {text.substring(0, visibleChars)}
                </span>
                <span className="text-white opacity-70">
                    {text.substring(visibleChars)}
                </span>
            </p>
        );
    };

    // Confetti elements
    const renderConfetti = () => {
        return Array(100).fill(0).map((_, i) => (
            <motion.div
                key={`confetti-${i}`}
                initial={{
                    top: "-5%",
                    left: `${Math.random() * 100}%`,
                    rotate: 0,
                    scale: 0
                }}
                animate={{
                    top: "105%",
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    scale: [0, 1, 0.5]
                }}
                transition={{
                    duration: 5 + Math.random() * 3,
                    delay: Math.random() * 3,
                    ease: [0.1, 0.25, 0.75, 1]
                }}
                className="absolute w-2 h-2 z-50"
                style={{
                    backgroundColor: ['#FF5E5B', '#D8D8D8', '#FFED66', '#00CECB', '#FF9EDA'][Math.floor(Math.random() * 5)],
                    borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                }}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen h-full w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 flex flex-col items-center justify-center text-white relative overflow-hidden px-4 py-8"
            onClick={handleUserInteraction}
        >
            {/* Background effects - floating particles */}
            <div className="absolute inset-0 opacity-20">
                {Array(40).fill(0).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.2, 1],
                            y: [0, -15, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 3
                        }}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Floating hearts background */}
            <div className="absolute inset-0 opacity-20">
                {Array(20).fill(0).map((_, i) => (
                    <motion.div
                        key={`heart-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            y: [0, -30, 0],
                            scale: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: Math.random() * 8 + 6,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className="absolute text-pink-400"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                        }}
                    >
                        ❤️
                    </motion.div>
                ))}
            </div>

            {/* Gradient orbs */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 2 }}
            >
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-pink-500 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
            </motion.div>

            {/* Name title with animation */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center mb-8 md:mb-10 z-10 relative"
            >
                <div className="absolute -inset-1 bg-pink-500 opacity-30 blur-md rounded-lg"></div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 font-display relative">
                    Najmita Zahira
                </h1>
                <motion.p
                    className="text-sm md:text-base italic text-purple-200 opacity-80 relative"
                    animate={{
                        textShadow: ["0 0 5px rgba(255,255,255,0)", "0 0 15px rgba(255,192,203,0.7)", "0 0 5px rgba(255,255,255,0)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Yang selalu indah di hatiku
                </motion.p>
            </motion.div>

            {/* Lyrics display with enhanced animations */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl h-40 md:h-48 lg:h-56 mb-8 md:mb-10 flex items-center justify-center overflow-hidden"
            >
                {/* Glass card effect */}
                <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-filter backdrop-blur-md rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-10 rounded-xl"></div>
                <div className="absolute inset-0 border border-white border-opacity-10 rounded-xl"></div>

                {/* Card inner glow */}
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                        boxShadow: [
                            "inset 0 0 15px rgba(255,105,180,0.1)",
                            "inset 0 0 25px rgba(255,105,180,0.3)",
                            "inset 0 0 15px rgba(255,105,180,0.1)"
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {!userInteracted && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-xl z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.p
                            className="text-white text-center px-4 md:text-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Klik di mana saja untuk memulai musik
                        </motion.p>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentLyricIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center px-6 text-center"
                    >
                        {renderLyric()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Music control buttons and feature buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-4 z-10 mb-6"
            >
                {/* Music controls */}
                <div className="flex items-center space-x-4">
                    {!isPlaying && !songEnded && (
                        <motion.button
                            onClick={handlePlay}
                            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-pink-500/20 transition-all"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,105,180,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Putar"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </motion.button>
                    )}

                    {isPlaying && (
                        <motion.button
                            onClick={handlePause}
                            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-pink-500/20 transition-all"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,105,180,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Jeda"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        </motion.button>
                    )}

                    {songEnded && (
                        <motion.button
                            onClick={handleRepeat}
                            className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-pink-500/20 transition-all"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,105,180,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Ulangi"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                        </motion.button>
                    )}
                </div>

                {/* Feature buttons - only show when user has interacted */}
                {userInteracted && (
                    <div className="flex items-center space-x-4">
                        {/* Love message button */}
                        <motion.button
                            onClick={toggleLoveMessage}
                            className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-4 rounded-full shadow-lg transition-all"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,105,180,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">❤️</span>
                            <span className="text-sm md:text-base">Pesan Cinta</span>
                        </motion.button>

                        {/* Gift button */}
                        <motion.button
                            onClick={toggleGift}
                            className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-full shadow-lg transition-all"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(111,105,255,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-2">🎁</span>
                            <span className="text-sm md:text-base">Hadiah</span>
                        </motion.button>
                    </div>
                )}
            </motion.div>

            {/* Romantic message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-4 text-center max-w-xs md:max-w-sm px-4 z-10 relative"
            >
                <div className="absolute -inset-1 bg-pink-500 opacity-20 blur-md rounded-lg"></div>
                <motion.p
                    className="text-sm md:text-base text-purple-100 relative font-display"
                    animate={{
                        textShadow: ["0 0 5px rgba(255,255,255,0)", "0 0 10px rgba(255,192,203,0.5)", "0 0 5px rgba(255,255,255,0)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    Najmita Zahira Dirgantoro, kamu sempurna di hatiku selamanya ❤️
                </motion.p>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-4 text-center text-xs md:text-sm text-purple-200 z-10 w-full"
            >
                <p>Inspired by: "Kamu Cantik" - The Overtunes</p>
            </motion.div>

            {/* Hidden audio player */}
            <audio
                ref={audioRef}
                className="hidden"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src="/lagu/kamu_cantik.mp3" type="audio/mp3" />
                Browser Anda tidak mendukung elemen audio.
            </audio>

            {/* Love Message Modal */}
            <AnimatePresence>
                {showLoveMessage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLoveMessage();
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

                        <motion.div
                            className="relative bg-gradient-to-br from-pink-900 to-purple-900 rounded-xl p-6 max-w-md w-full shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal content */}
                            <div className="text-center relative z-10">
                                <motion.div
                                    className="text-3xl mb-2"
                                    animate={{
                                        scale: heartBurst ? [1, 1.5, 1] : 1,
                                        rotate: heartBurst ? [-5, 5, 0] : 0,
                                        color: heartBurst ? ["#ff6b6b", "#ff8e8e", "#ff6b6b"] : "#ff6b6b"
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    ❤️
                                </motion.div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-pink-100">Pesan Cinta untuk Najmita</h3>
                                <motion.div
                                    className="bg-white bg-opacity-10 rounded-lg p-4 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-black/50 text-lg italic">{loveMessages[loveMessageIndex]}</p>
                                </motion.div>

                                <div className="flex justify-between">
                                    <motion.button
                                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-sm shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setLoveMessageIndex((prev) => (prev + 1) % loveMessages.length);
                                            setHeartBurst(true);
                                            setTimeout(() => setHeartBurst(false), 1000);
                                        }}
                                    >
                                        Pesan Lainnya
                                    </motion.button>

                                    <motion.button
                                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleLoveMessage}
                                    >
                                        Tutup
                                    </motion.button>
                                </div>
                            </div>

                            {/* Modal background effects */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-pink-500 opacity-10 blur-xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-500 opacity-10 blur-xl"></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gift Modal with REAL QR Code */}
            <AnimatePresence>
                {showGift && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleGift();
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

                        <motion.div
                            className="relative bg-gradient-to-br from-pink-700 to-purple-900 rounded-xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Gift content */}
                            <div className="text-center relative z-10">
                                <motion.div
                                    className="text-3xl mb-2"
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        y: [0, -5, 0]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                                >
                                    🎁
                                </motion.div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-pink-100">Hadiah Digital untuk Cantikku</h3>

                                {/* QR Code Area - PAKAI GAMBAR ASLI */}
                                <div className="bg-white/90 rounded-lg p-4 mb-6 mx-auto max-w-xs shadow-lg">
                                    <div className="mb-2 flex justify-center">
                                        {/* Ganti dengan QR code asli kamu */}
                                        <img
                                            src="/path-to-your-qr-image.png"  // Ganti dengan path QR code kamu
                                            alt="QR Code Hadiah"
                                            className="w-48 h-48 object-contain border-2 border-pink-200 rounded"
                                            onClick={() => window.open('https://link-ucapan-kamu.com', '_blank')} // Auto redirect ketika diklik
                                        />

                                        {/* Scan animation */}
                                        <motion.div
                                            className="absolute w-48 h-2 bg-pink-500 opacity-50 top-1/2"
                                            animate={{
                                                top: ["10%", "90%", "10%"],
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                    </div>
                                    <p className="text-gray-700 text-sm font-medium">
                                        Scan QR code ini atau tap aja buat buka surprise-nya!
                                    </p>
                                </div>

                                {/* Personalized Message */}
                                <motion.div
                                    className="bg-pink-800/40 rounded-lg p-4 mb-6 backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="text-white/90">
                                        "Mbul, ini hadiah digital spesial buat ulang tahun kamu!
                                        Aku udah siapin sesuatu yang bakal bikin kamu senyum-senyum sendiri 😉
                                        Jangan lupa screenshot dan tag aku ya!"
                                    </p>
                                </motion.div>

                                <motion.button
                                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,105,180,0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleGift}
                                >
                                    Tutup Dulu
                                </motion.button>
                            </div>

                            {/* Floating elements */}
                            {Array(10).fill(0).map((_, i) => (
                                <motion.div
                                    key={`float-${i}`}
                                    className="absolute text-xl text-pink-400"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.4, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 3,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                >
                                    {['🎀', '💖', '✨', '🎉', '🎈'][i % 5]}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti effect when opening gift */}
            {showConfetti && renderConfetti()}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-30"></div>

            {/* New feature: Animated photo frame that appears after some time */}
            <AnimatePresence>
                {userInteracted && (
                    <motion.div
                        className="fixed bottom-16 right-4 md:bottom-16 md:right-8 z-20"
                        initial={{ opacity: 0, scale: 0, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: 5, duration: 0.8, type: "spring" }}
                    >
                        <motion.div
                            className="relative w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-xl"
                            whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setHeartBurst(true);
                                setTimeout(() => setHeartBurst(false), 1000);
                            }}
                        >
                            {/* Decorative photo frame */}
                            <div className="absolute inset-0 border-4 border-pink-300 rounded-lg z-10"></div>
                            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400"></div> */}

                            {/* Placeholder for photo */}
                            <div className="absolute inset-2 bg-gray-200 flex items-center justify-center">
                                <img src="/images/photo-profil/photo-profil-nami.webp" alt="photo nami" className='w-full h-full object-cover' />
                            </div>

                            {/* Animated heart when clicked */}
                            {heartBurst && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center z-20"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.5, 0] }}
                                    transition={{ duration: 1 }}
                                >
                                    <span className="text-2xl md:text-3xl text-pink-500">❤️</span>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Feature: Dancing heart that follows cursor on desktop
                {userInteracted && (
                    <motion.div
                        className="fixed w-8 h-8 pointer-events-none z-30 hidden md:flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 0.7,
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            opacity: { delay: 2, duration: 1 },
                            scale: { repeat: Infinity, duration: 2 },
                            rotate: { repeat: Infinity, duration: 3 }
                        }}
                        style={{
                            x: -16,
                            y: -16
                        }}
                    >
                        <span className="text-2xl">💞</span>
                    </motion.div>
                )} */}
        </motion.div>
    );
};

export default EnhancedLyricsPage;