import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Calendar, Lock } from 'lucide-react';
import * as THREE from 'three';

// Fix the import naming conflict
import { useNavigate as useReactNavigate } from 'react-router-dom';

// Make the router imports optional
let navigateHook: Function | null = null;

try {
    // Try to import React Router components
    const router = require('react-router-dom');
    navigateHook = router.useNavigate;
} catch (e) {
    // Router not available, will handle this case
    console.log('React Router not available');
}

export interface PersonConfig {
    name: string;
    birthday: Date;
    color: string;
    secondaryColor?: string;
    redirectToLyrics?: boolean;
    imageUrl?: string;
    specialMessage?: string;
}

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: PersonConfig;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, person }) => {
    const [showContent, setShowContent] = useState(false);
    const [unwrapped, setUnwrapped] = useState(false);
    const [isDateReached, setIsDateReached] = useState(false);
    const [, setIsWithinCelebrationPeriod] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const giftRef = useRef<THREE.Group | null>(null);

    // Use the direct import if available, otherwise try the dynamic import
    const navigate = useReactNavigate ? useReactNavigate() : (navigateHook ? navigateHook() : null);

    // Date checking logic
    useEffect(() => {
        if (!isOpen) return;

        const today = new Date();
        const celebrationEndDate = new Date(person.birthday);
        celebrationEndDate.setDate(celebrationEndDate.getDate() + 14); // 2 weeks celebration period

        setIsDateReached(today >= person.birthday);
        setIsWithinCelebrationPeriod(
            today >= person.birthday && today <= celebrationEndDate
        );
        
        // No auto-redirect - only navigate on button click
    }, [isOpen, person]);

    // Animation timing
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShowContent(true), 800);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
            setUnwrapped(false);
        }
    }, [isOpen]);

    const handleOpenVoucher = () => {
        console.log("Voucher button clicked, attempting to navigate to /lyrics");
        
        if (navigate) {
            console.log("Using React Router navigation");
            navigate('/lyrics');
        } else {
            console.log("React Router navigation not available, using fallback");
            // Fallback if navigate is not available
            window.location.href = '/lyrics';
        }
    };

    // Three.js setup
    useEffect(() => {
        if (isOpen && containerRef.current && !sceneRef.current) {
            // Scene setup
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Camera setup
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.z = 5;
            cameraRef.current = camera;

            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(200, 200);
            renderer.setClearColor(0x000000, 0);
            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Create 3D gift box
            const giftGroup = new THREE.Group();

            // Gift box with person's color
            const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
            const boxMaterial = new THREE.MeshPhongMaterial({
                color: parseInt(person.color.substring(1), 16),
                shininess: 100,
                specular: 0xffffff
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            giftGroup.add(box);

            // Ribbon with secondary color or default
            const ribbonColor = person.secondaryColor || '#ff4499';
            const ribbonVerticalGeometry = new THREE.BoxGeometry(0.3, 2.1, 0.3);
            const ribbonHorizontalGeometry = new THREE.BoxGeometry(2.1, 0.3, 0.3);
            const ribbonMaterial = new THREE.MeshPhongMaterial({
                color: parseInt(ribbonColor.substring(1), 16),
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

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            // Animation loop
            const animate = () => {
                if (!giftRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

                requestAnimationFrame(animate);
                giftRef.current.rotation.y += 0.01;
                giftRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            };

            animate();

            // Cleanup
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
    }, [isOpen, person]);

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

    const handleUnwrap = () => {
        setUnwrapped(true);
        
        // Animate gift opening
        if (giftRef.current) {
            const animate = () => {
                if (!giftRef.current) return;
                giftRef.current.scale.x += 0.05;
                giftRef.current.scale.y += 0.05;
                giftRef.current.scale.z += 0.05;

                if (giftRef.current.scale.x < 1.5) {
                    requestAnimationFrame(animate);
                } else {
                    giftRef.current.visible = false;
                }
            };
            animate();
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getUnlockDate = () => formatDate(person.birthday);

    // Particles for animation
    const particles = Array.from({ length: 20 });

    if (!isOpen) return null;

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
                    <div className="perspective-1000 relative w-full max-w-sm">
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
                            <motion.div
                                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden"
                                animate={{
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                    scale: showContent ? 1 : 0.95
                                }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 }}
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors cursor-pointer z-30 shadow-md"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </motion.button>

                                <AnimatePresence>
                                    {unwrapped && particles.map((_, i) => (
                                        <motion.div
                                            key={`particle-${i}`}
                                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
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
                                                        Ada hadiah untuk {person.name}! ✨
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Yuk buka hadiahnya...
                                                    </p>
                                                </motion.div>

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
                                                {isDateReached ? (
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
                                                                        boxShadow: [
                                                                            '0 0 20px 0px rgba(244, 63, 94, 0.6)',
                                                                            '0 0 40px 10px rgba(244, 63, 94, 0.6)',
                                                                            '0 0 20px 0px rgba(244, 63, 94, 0.6)'
                                                                        ]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity
                                                                    }}
                                                                >
                                                                    {person.imageUrl ? (
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
                                                                            <img
                                                                                src={person.imageUrl}
                                                                                alt={`Special gift for ${person.name}`}
                                                                                className="w-16 h-16 object-cover rounded-full"
                                                                            />
                                                                        </motion.div>
                                                                    ) : (
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
                                                                    )}
                                                                </motion.div>
                                                            </div>
                                                        </motion.div>

                                                        <div className="space-y-3">
                                                            <motion.h3
                                                                className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.4 }}
                                                            >
                                                                Selamat Ulang Tahun {person.name}! 🎂
                                                            </motion.h3>
                                                            <motion.p
                                                                className="text-gray-600"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.6 }}
                                                            >
                                                                {person.specialMessage || 'Semoga selalu diberi kesehatan, keberkahan, dan kebahagiaan. Aku sayang kamu! ❤️'}
                                                            </motion.p>
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.8 }}
                                                                className="mt-4 text-center"
                                                            >
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={handleOpenVoucher}
                                                                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-medium shadow-lg cursor-pointer"
                                                                >
                                                                    Buka Voucher Spesial
                                                                </motion.button>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div className="space-y-6">
                                                        <motion.div className="relative w-32 h-32 mx-auto">
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
                                                                <p>Hadiah akan terbuka pada:</p>
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
                                                                    <Sparkles className={`w-5 h-5 ${['text-pink-400', 'text-purple-400',
                                                                            'text-blue-400', 'text-indigo-400'][i]
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