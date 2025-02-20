import { useState } from 'react';
import { Bot, MessageSquare, ArrowRight, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/Card';
import DenaWarzaChat from './DenaWarzaChat';
import ChatbotUI from './ChatbotUI';
import { useIsMobile } from '../hooks/isMobile';
import TiltedCard from './ui/CardChatBotSelector';

interface Version {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    component: React.ComponentType;
    color: string;
    gradient: string;
}

const ChatbotVersionSelector = (): JSX.Element => {
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const isMobile = useIsMobile();

    // Using multiple refs for different entrance animations
    const [titleRef, titleInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '-50px 0px'
    });

    const [cardContainerRef, cardContainerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        delay: 300
    });

    const versions: Version[] = [
        {
            id: 'v1',
            title: 'ChatBot V1',
            description: 'Tanya jawab dengan template pertanyaan yang terarah',
            icon: <MessageSquare className="w-10 md:w-14 h-10 md:h-14" />,
            component: ChatbotUI,
            color: 'text-indigo-600',
            gradient: 'from-indigo-500/20 to-purple-500/20'
        },
        {
            id: 'v2',
            title: 'ChatBot V2',
            description: 'Pengalaman chat AI interaktif dengan Dena-Warza',
            icon: <Bot className="w-10 md:w-14 h-10 md:h-14" />,
            component: DenaWarzaChat,
            color: 'text-emerald-600',
            gradient: 'from-emerald-500/20 to-teal-500/20'
        }
    ];

    // Fancy entrance animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: {
            y: -60,
            opacity: 0,
            filter: "blur(8px)"
        },
        visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const subtitleVariants = {
        hidden: {
            y: 30,
            opacity: 0,
            scale: 0.9
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.2,
                duration: 0.6
            }
        }
    };

    // 3D card tilt animation effect
    const cardTiltEffect = (e: React.MouseEvent, cardId: string) => {
        if (isMobile) return;

        const card = e.currentTarget as HTMLElement; // Explicitly type as HTMLElement
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transition = "transform 0.1s ease-out"; // Smooth transition when moving
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        setHoveredCard(cardId);
    };

    const resetTilt = (e: React.MouseEvent) => {
        if (isMobile) return;

        const card = e.currentTarget as HTMLElement; // Explicitly type as HTMLElement
        card.style.transition = "transform 0.3s ease-in-out"; // Smooth reset transition
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        setHoveredCard(null);
    };

    // Staggered card entrance
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            rotateY: -15,
            scale: 0.8,
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            rotateY: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: i * 0.2 + 0.4,
                duration: 0.8,
            },
        }),
        hover: !isMobile
            ? {
                y: -8,
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.3,
                },
            }
            : {},
        tap: {
            scale: 0.97,
            transition: { duration: 0.1 },
        },
    };

    // Fancy transition when selecting a chatbot
    const selectionTransition = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    // Floating particles animation
    const Particles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-indigo-500/30"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3 + 0.2
                    }}
                    animate={{
                        y: [null, -Math.random() * 500 - 100],
                        opacity: [null, 0],
                        transition: {
                            duration: Math.random() * 10 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">
            {/* Background particles */}
            <Particles />

            {selectedVersion ? (
                <motion.div
                    className="relative w-full h-full min-h-screen"
                    variants={selectionTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.button
                        onClick={() => setSelectedVersion(null)}
                        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-slate-200 transition-all duration-300"
                        whileHover={{
                            rotate: 180,
                            backgroundColor: "#F3F4F6",
                            transition: { duration: 0.4 }
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.8, duration: 0.5 }
                        }}
                    >
                        <X className="w-5 h-5 text-slate-700" />
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.6, duration: 0.7 }
                        }}
                        className="w-full h-full pt-6"
                    >
                        {(() => {
                            const selectedVersionData = versions.find(v => v.id === selectedVersion);
                            const SelectedComponent = selectedVersionData?.component;
                            return SelectedComponent ? <SelectedComponent /> : null;
                        })()}
                    </motion.div>
                </motion.div>
            ) : (
                <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                    <motion.div
                        ref={titleRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate={titleInView ? "visible" : "hidden"}
                        className="text-center mb-16 md:mb-24"
                    >
                        <motion.div className="mb-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 text-indigo-700 border border-indigo-200/50">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Pilih Asisten AI</span>
                        </motion.div>

                        <motion.h1
                            variants={titleVariants}
                            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700"
                        >
                            Pilih Chatbot Anda
                        </motion.h1>

                        <motion.p
                            variants={subtitleVariants}
                            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
                        >
                            Pilih versi chatbot yang sesuai dengan kebutuhan Anda untuk pengalaman interaksi yang optimal
                        </motion.p>

                    </motion.div>

                    <motion.div
                        ref={cardContainerRef}
                        initial="hidden"
                        animate={cardContainerInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
                    >
                        {versions.map((version, i) => (
                            <motion.div
                                key={version.id}
                                custom={i}
                                variants={cardVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setSelectedVersion(version.id)}
                                onMouseMove={(e) => cardTiltEffect(e, version.id)}
                                onMouseLeave={resetTilt}
                                className="h-full perspective"
                            >
                                <Card className={`
                                    group relative overflow-hidden h-full cursor-pointer
                                    border-2 transition-all duration-500 will-change-transform
                                    ${hoveredCard === version.id ? `border-${version.color.split('-')[1]}-300` : 'border-slate-200'}
                                    bg-white/80 backdrop-blur-sm
                                `}>
                                    {/* Animated gradient background */}
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-br ${version.gradient} opacity-0
                                        group-hover:opacity-100 transition-opacity duration-500 z-0
                                    `} />

                                    {/* Content */}
                                    <CardContent className="relative z-10 p-8 md:p-10">
                                        <div className="flex flex-col md:flex-row items-start gap-6">
                                            <motion.div
                                                className={`flex-shrink-0 p-4 rounded-2xl bg-white shadow-md ${version.color}`}
                                                whileHover={{
                                                    rotate: [0, -10, 10, 0],
                                                    scale: 1.05,
                                                    transition: { duration: 0.5, repeat: 1 }
                                                }}
                                            >
                                                {version.icon}
                                            </motion.div>

                                            <div className="flex-grow">
                                                <h2 className={`text-3xl font-bold mb-3 ${version.color}`}>
                                                    {version.title}
                                                </h2>
                                                <p className="text-slate-600 text-lg mb-6">
                                                    {version.description}
                                                </p>

                                                <motion.div
                                                    className={`
                                                        inline-flex items-center gap-2 font-medium ${version.color}
                                                        px-4 py-2 rounded-full border border-current
                                                    `}
                                                    whileHover={{
                                                        x: 5,
                                                        transition: { repeat: Infinity, repeatType: "mirror", duration: 0.6 }
                                                    }}
                                                >
                                                    <span>Mulai Chat</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Feature highlights */}
                                        <div className="mt-8 pt-6 border-t border-slate-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    version.id === 'v1' ? ["Template Pertanyaan", "Hasil Terarah"] : ["AI Pintar", "Percakapan Natural"],
                                                    version.id === 'v1' ? ["Riwayat Chat", "Tersimpan Otomatis"] : ["Respons Cepat", "Mudah Digunakan"]
                                                ].map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <div className={`p-1 rounded-full ${version.color} bg-opacity-10`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-slate-700 font-medium">{feature[0]}</span>
                                                        <span className="text-xs text-slate-500">{feature[1]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ChatbotVersionSelector;