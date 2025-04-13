import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Calendar, Lock } from 'lucide-react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, name }) => {
    const [showContent, setShowContent] = useState(false);
    const [unwrapped, setUnwrapped] = useState(false);
    const [isDateReached, setIsDateReached] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const giftRef = useRef<THREE.Group | null>(null);

    // Check if the target date has been reached
    useEffect(() => {
        const today = new Date();

        // Set the target dates for each person
        let targetDate;
        if (name === 'Defano') {
            // October 13, 2025
            targetDate = new Date(2025, 9, 13);
        } else if (name === 'Najmita') {
            // May 17, 2025
            targetDate = new Date(2025, 4, 17);
        } else {
            // Anniversary - September 27, 2025
            targetDate = new Date(2025, 8, 27);
        }

        // For testing purposes, uncomment this to simulate that the date is reached
        // setIsDateReached(true);

        // For production, use this:
        setIsDateReached(today >= targetDate);

    }, [name]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShowContent(true), 800);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
            setUnwrapped(false);
        }
    }, [isOpen]);

    // Three.js setup
    useEffect(() => {
        if (isOpen && containerRef.current && !sceneRef.current) {
            // Initialize Three.js scene
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Camera
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.z = 5;
            cameraRef.current = camera;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(200, 200);
            renderer.setClearColor(0x000000, 0);
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Create 3D gift box
            const giftGroup = new THREE.Group();

            // Gift box
            const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

            // Different colors for different people
            let boxColor;
            if (name === 'Defano') {
                boxColor = 0x6366f1; // indigo
            } else if (name === 'Najmita') {
                boxColor = 0xec4899; // pink
            } else {
                boxColor = 0x8b5cf6; // purple
            }

            const boxMaterial = new THREE.MeshPhongMaterial({
                color: boxColor,
                shininess: 100,
                specular: 0xffffff
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            giftGroup.add(box);

            // Ribbon
            const ribbonVerticalGeometry = new THREE.BoxGeometry(0.3, 2.1, 0.3);
            const ribbonHorizontalGeometry = new THREE.BoxGeometry(2.1, 0.3, 0.3);
            const ribbonMaterial = new THREE.MeshPhongMaterial({
                color: 0xff4499,
                shininess: 100,
                specular: 0xffffff
            });

            const ribbonVertical = new THREE.Mesh(ribbonVerticalGeometry, ribbonMaterial);
            const ribbonHorizontal = new THREE.Mesh(ribbonHorizontalGeometry, ribbonMaterial);

            ribbonVertical.position.z = 1.01;
            ribbonHorizontal.position.z = 1.01;

            giftGroup.add(ribbonVertical);
            giftGroup.add(ribbonHorizontal);

            // Bow
            const bowGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
            const bow1 = new THREE.Mesh(bowGeometry, ribbonMaterial);
            const bow2 = new THREE.Mesh(bowGeometry, ribbonMaterial);

            bow1.rotation.z = Math.PI / 4;
            bow2.rotation.z = -Math.PI / 4;

            bow1.position.z = 1.2;
            bow2.position.z = 1.2;

            giftGroup.add(bow1);
            giftGroup.add(bow2);

            scene.add(giftGroup);
            giftRef.current = giftGroup;

            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            // Animation function
            const animate = () => {
                if (!giftRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

                requestAnimationFrame(animate);

                // Rotate the gift
                giftRef.current.rotation.y += 0.01;
                giftRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;

                // Render
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            };

            animate();

            // Cleanup function
            return () => {
                if (rendererRef.current && containerRef.current) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                    rendererRef.current.dispose();
                }

                sceneRef.current = null;
                cameraRef.current = null;
                rendererRef.current = null;
                giftRef.current = null;
            };
        }
    }, [isOpen, name]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current && containerRef.current) {
                const size = 200;
                rendererRef.current.setSize(size, size);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isOpen) return null;

    const handleUnwrap = () => {
        setUnwrapped(true);

        // Animate the gift box to open
        if (giftRef.current) {
            // Animate opening by scaling up slightly and then disappearing
            const animate = () => {
                if (!giftRef.current) return;

                giftRef.current.scale.x += 0.05;
                giftRef.current.scale.y += 0.05;
                giftRef.current.scale.z += 0.05;

                if (giftRef.current.scale.x < 1.5) {
                    requestAnimationFrame(animate);
                } else {
                    // Make it disappear
                    giftRef.current.visible = false;
                }
            };

            animate();
        }
    };

    // Format the date for display
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    // Get the unlock date for the current name
    const getUnlockDate = () => {
        if (name === 'Defano') {
            return formatDate(new Date(2025, 9, 13));
        } else if (name === 'Najmita') {
            return formatDate(new Date(2025, 4, 17));
        } else {
            return formatDate(new Date(2025, 8, 27));
        }
    };

    // Particles for the gift opening effect
    const particles = Array.from({ length: 20 });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.6 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    {/* Modal container with 3D perspective */}
                    <div className="perspective-1000 relative w-full max-w-sm">
                        {/* Gift box that opens */}
                        <motion.div
                            initial={{ rotateX: 90, y: -100, opacity: 0 }}
                            animate={{ rotateX: 0, y: 0, opacity: 1 }}
                            exit={{ rotateX: 90, y: 100, opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 100,
                                duration: 0.8
                            }}
                            className="relative w-full max-w-sm mx-auto"
                        >
                            {/* Main content */}
                            <motion.div
                                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden"
                                animate={{
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                    scale: showContent ? 1 : 0.95
                                }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                {/* Close button */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 }}
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors cursor-pointer z-30 shadow-md"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </motion.button>

                                {/* Particles that shoot out when gift is unwrapped */}
                                <AnimatePresence>
                                    {unwrapped && particles.map((_, i) => (
                                        <motion.div
                                            key={`particle-${i}`}
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                opacity: 1,
                                                scale: 1
                                            }}
                                            animate={{
                                                x: (Math.random() - 0.5) * 400,
                                                y: (Math.random() - 0.5) * 400,
                                                opacity: 0,
                                                rotate: Math.random() * 360,
                                                scale: 0
                                            }}
                                            transition={{
                                                duration: 1 + Math.random() * 0.5,
                                                ease: "easeOut"
                                            }}
                                            className="absolute top-1/2 left-1/2 z-20 w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: [
                                                    '#F472B6', '#C084FC', '#818CF8',
                                                    '#FB7185', '#E879F9', '#60A5FA'
                                                ][Math.floor(Math.random() * 6)],
                                                marginLeft: -6,
                                                marginTop: -6
                                            }}
                                        />
                                    ))}
                                </AnimatePresence>

                                <div className="pt-8 pb-8 px-6 relative">
                                    <AnimatePresence mode="wait">
                                        {!unwrapped ? (
                                            <motion.div
                                                key="gift-closed"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-center space-y-6 pb-4"
                                            >
                                                <motion.div
                                                    className="relative h-48 w-48 mx-auto"
                                                    animate={{
                                                        rotate: [0, 2, -2, 0],
                                                        y: [0, -5, 0]
                                                    }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        repeatType: "reverse"
                                                    }}
                                                >
                                                    {/* Three.js container */}
                                                    <div
                                                        ref={containerRef}
                                                        className="w-full h-full flex items-center justify-center"
                                                    />
                                                </motion.div>

                                                <motion.div
                                                    className="space-y-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.8 }}
                                                >
                                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                                        Ada hadiah untuk {name}! ✨
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Yuk buka hadiahnya...
                                                    </p>
                                                </motion.div>
                                                <Link to="Lyrics">
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{
                                                            delay: 1,
                                                            type: "spring",
                                                            stiffness: 200
                                                        }}
                                                        whileHover={{
                                                            scale: 1.05,
                                                            boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
                                                        }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleUnwrap}
                                                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-lg font-medium"
                                                    >
                                                        Buka Hadiah
                                                    </motion.button>
                                                </Link>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="gift-open"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 200,
                                                    delay: 0.3
                                                }}
                                                className="text-center space-y-6 py-6"
                                            >
                                                {/* Show different content based on whether date is reached */}
                                                {isDateReached ? (
                                                    // Content when date is reached
                                                    <motion.div className="space-y-6">
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -10, 0],
                                                                scale: [1, 1.05, 1]
                                                            }}
                                                            transition={{
                                                                duration: 3,
                                                                repeat: Infinity,
                                                                repeatType: "reverse"
                                                            }}
                                                            className="relative"
                                                        >
                                                            {name === 'Defano' ? (
                                                                <div className="relative w-32 h-32 mx-auto">
                                                                    <motion.div
                                                                        animate={{
                                                                            rotate: 360
                                                                        }}
                                                                        transition={{
                                                                            duration: 20,
                                                                            repeat: Infinity,
                                                                            ease: "linear"
                                                                        }}
                                                                        className="absolute inset-0 flex items-center justify-center"
                                                                    >
                                                                        {[...Array(8)].map((_, i) => (
                                                                            <motion.div
                                                                                key={i}
                                                                                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                                                                                initial={{ opacity: 0.4 }}
                                                                                animate={{
                                                                                    opacity: [0.4, 1, 0.4],
                                                                                    scale: [1, 1.3, 1]
                                                                                }}
                                                                                transition={{
                                                                                    duration: 2,
                                                                                    delay: i * 0.25,
                                                                                    repeat: Infinity
                                                                                }}
                                                                                style={{
                                                                                    top: '50%',
                                                                                    left: '50%',
                                                                                    transform: `rotate(${i * 45}deg) translateX(45px)`
                                                                                }}
                                                                            />
                                                                        ))}
                                                                    </motion.div>
                                                                    <motion.div
                                                                        className="w-28 h-28 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-xl z-10 relative"
                                                                        animate={{
                                                                            boxShadow: ['0 0 20px 0px rgba(79, 70, 229, 0.6)', '0 0 40px 10px rgba(79, 70, 229, 0.6)', '0 0 20px 0px rgba(79, 70, 229, 0.6)']
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity
                                                                        }}
                                                                    >
                                                                        <motion.div
                                                                            animate={{
                                                                                rotate: [0, 360],
                                                                                scale: [1, 1.1, 1]
                                                                            }}
                                                                            transition={{
                                                                                rotate: {
                                                                                    duration: 10,
                                                                                    repeat: Infinity,
                                                                                    ease: "linear"
                                                                                },
                                                                                scale: {
                                                                                    duration: 3,
                                                                                    repeat: Infinity,
                                                                                    repeatType: "reverse"
                                                                                }
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src="/api/placeholder/64/64"
                                                                                alt="Special gift for Defano"
                                                                                className="w-16 h-16 object-cover rounded-full"
                                                                            />
                                                                        </motion.div>
                                                                    </motion.div>
                                                                </div>
                                                            ) : (
                                                                <div className="relative w-32 h-32 mx-auto">
                                                                    <motion.div
                                                                        animate={{
                                                                            scale: [1, 1.2, 1],
                                                                            opacity: [0.3, 0.6, 0.3]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity,
                                                                        }}
                                                                        className="absolute inset-0 bg-pink-400 rounded-full filter blur-xl"
                                                                    />
                                                                    <motion.div
                                                                        className="w-28 h-28 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-xl z-10 relative"
                                                                        animate={{
                                                                            boxShadow: ['0 0 20px 0px rgba(244, 63, 94, 0.6)', '0 0 40px 10px rgba(244, 63, 94, 0.6)', '0 0 20px 0px rgba(244, 63, 94, 0.6)']
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity
                                                                        }}
                                                                    >
                                                                        <motion.div
                                                                            animate={{
                                                                                scale: [1, 1.2, 0.9, 1.2, 1],
                                                                            }}
                                                                            transition={{
                                                                                duration: 2,
                                                                                repeat: Infinity,
                                                                                repeatType: "reverse"
                                                                            }}
                                                                        >
                                                                            <Heart className="w-14 h-14 text-white" />
                                                                        </motion.div>
                                                                    </motion.div>
                                                                </div>
                                                            )}
                                                        </motion.div>

                                                        <div className="space-y-3">
                                                            <motion.h3
                                                                className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.4 }}
                                                            >
                                                                {name === 'Defano' ?
                                                                    'Selamat Ulang Tahun! 🎂' :
                                                                    'Selamat Ulang Tahun! 🎂'}
                                                            </motion.h3>
                                                            <motion.p
                                                                className="text-gray-600"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.6 }}
                                                            >
                                                                {name === 'Defano' ?
                                                                    'Semoga selalu sehat, bahagia, dan sukses dalam semua hal. Aku sayang kamu! ❤️' :
                                                                    'Semoga selalu diberi kesehatan, keberkahan, dan kebahagiaan. Aku sayang kamu! ❤️'}
                                                            </motion.p>

                                                            <motion.div
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.8 }}
                                                                className="mt-4 text-center"
                                                            >
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-medium shadow-lg"
                                                                >
                                                                    Buka Voucher Spesial
                                                                </motion.div>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    // Content when date is not reached
                                                    <motion.div className="space-y-6">
                                                        <motion.div
                                                            className="relative w-32 h-32 mx-auto"
                                                        >
                                                            <motion.div
                                                                animate={{
                                                                    rotateY: [0, 360],
                                                                }}
                                                                transition={{
                                                                    duration: 8,
                                                                    repeat: Infinity,
                                                                    ease: "linear"
                                                                }}
                                                                className="w-full h-full absolute flex items-center justify-center"
                                                            >
                                                                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg flex items-center justify-center">
                                                                    <motion.div
                                                                        animate={{
                                                                            scale: [1, 1.1, 1]
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Infinity
                                                                        }}
                                                                        className="relative"
                                                                    >
                                                                        <Lock className="w-12 h-12 text-purple-500" />
                                                                    </motion.div>
                                                                </div>
                                                            </motion.div>
                                                        </motion.div>

                                                        {/* ini ntuk hadiahnya ya bisa diganti */}
                                                        <div className="space-y-3">
                                                            <motion.h3
                                                                className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.4 }}
                                                            >
                                                                Hadiah Terkunci! 🔒
                                                            </motion.h3>
                                                            <motion.div
                                                                className="text-gray-600 space-y-2"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.6 }}
                                                            >
                                                                <p>
                                                                    Hadiah akan terbuka pada:
                                                                </p>
                                                                <div className="flex items-center justify-center space-x-2 text-purple-600 font-medium">
                                                                    <Calendar className="w-5 h-5" />
                                                                    <span>{getUnlockDate()}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-2">
                                                                    Simpan tanggalnya ya! Jangan lupa untuk cek lagi pada hari spesialmu.
                                                                </p>
                                                            </motion.div>
                                                        </div>

                                                        <motion.div
                                                            className="flex justify-center space-x-3"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.8 }}
                                                        >
                                                            {[...Array(4)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{
                                                                        y: [0, -8, 0],
                                                                        opacity: [0.5, 1, 0.5]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2 + i * 0.3,
                                                                        repeat: Infinity,
                                                                        delay: i * 0.2,
                                                                    }}
                                                                >
                                                                    <Sparkles className={`w-5 h-5 ${[
                                                                            'text-pink-400',
                                                                            'text-purple-400',
                                                                            'text-blue-400',
                                                                            'text-indigo-400'
                                                                        ][i]
                                                                        }`} />
                                                                </motion.div>
                                                            ))}
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GiftModal;