import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import useInView from '../../hooks/useInView';
import { ChevronRight, Eye } from 'lucide-react';
import {useIsMobile} from '../../hooks/isMobile';

interface Story {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    fullStory: string;
    color: string;
    hoverColor: string;
}

interface StoryCardProps {
    story: Story;
    index: number;
    setSelectedStory: (story: Story | null) => void;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(({ story, index, setSelectedStory }) => {
    const { setRef, inView } = useInView(0.5); // Threshold rendah untuk trigger lebih awal
    const controls = useAnimation();
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);
    
    // Seed generator untuk konsistensi efek berdasarkan index
    const getVariantType = (idx: number, totalVariants: number) => {
        return idx % totalVariants;
    };

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    // ===== ENTRANCE EFFECTS: 5 variasi untuk card =====
    const entranceVariants = [
        // 1. Flip and scale
        {
            hidden: { 
                opacity: 0, 
                rotateY: 90,
                scale: 0.8,
                x: 50
            },
            visible: {
                opacity: 1,
                rotateY: 0,
                scale: 1,
                x: 0,
                transition: { 
                    type: "spring", 
                    stiffness: 70,
                    damping: 12,
                    delay: index * 0.2,
                    duration: 1.5
                }
            }
        },
        
        // 2. Slide up with bounce
        {
            hidden: { 
                opacity: 0, 
                y: 100,
                scale: 0.9
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 50,
                    damping: 12,
                    delay: index * 0.15,
                    duration: 1.3
                }
            }
        },
        
        // 3. Fade in with slight rotation
        {
            hidden: { 
                opacity: 0, 
                rotate: -5,
                x: -40,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                rotate: 0,
                x: 0,
                scale: 1,
                transition: { 
                    type: "tween", 
                    ease: "easeOut",
                    delay: index * 0.18,
                    duration: 1.2
                }
            }
        },
        
        // 4. Zoom in from center with slight tilt
        {
            hidden: { 
                opacity: 0,
                scale: 0.5,
                rotateX: 20,
                y: 30
            },
            visible: {
                opacity: 1,
                scale: 1,
                rotateX: 0,
                y: 0,
                transition: { 
                    type: "spring", 
                    stiffness: 60,
                    damping: 15,
                    delay: index * 0.17,
                    duration: 1.4
                }
            }
        },
        
        // 5. Slide from side with perspective
        {
            hidden: { 
                opacity: 0,
                x: index % 2 === 0 ? 80 : -80,
                skewX: index % 2 === 0 ? "10deg" : "-10deg",
                scale: 0.9
            },
            visible: {
                opacity: 1,
                x: 0,
                skewX: "0deg",
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 50,
                    damping: 10,
                    delay: index * 0.16,
                    duration: 1.3
                }
            }
        }
    ];

    // ===== ICON ANIMATIONS: 4 variasi untuk icon =====
    const iconVariants = [
        // 1. Spinning entrance
        {
            hidden: { 
                opacity: 0, 
                rotate: -180,
                scale: 0.2
            },
            visible: {
                opacity: 1,
                rotate: 0,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 120,
                    damping: 14,
                    delay: index * 0.2 + 0.3,
                    duration: 0.9
                }
            }
        },
        
        // 2. Bounce from bottom
        {
            hidden: { 
                opacity: 0, 
                y: 50,
                scale: 0.5
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 300,
                    damping: 15,
                    delay: index * 0.2 + 0.2,
                    duration: 0.7
                }
            }
        },
        
        // 3. Zoom from center with pulse
        {
            hidden: { 
                opacity: 0, 
                scale: 0.1
            },
            visible: {
                opacity: 1,
                scale: [0.1, 1.2, 1],
                transition: { 
                    type: "spring", 
                    times: [0, 0.6, 1],
                    delay: index * 0.2 + 0.35,
                    duration: 1
                }
            }
        },
        
        // 4. Appear with blur (simulated)
        {
            hidden: { 
                opacity: 0, 
                filter: "blur(10px)",
                scale: 1.5
            },
            visible: {
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                transition: { 
                    type: "tween", 
                    ease: "easeOut",
                    delay: index * 0.2 + 0.3,
                    duration: 0.8
                }
            }
        }
    ];

    // ===== TEXT ANIMATIONS: 3 variasi teks dan judul =====
    const textVariants = [
        // 1. Cascading letters (simulated with lines)
        {
            hidden: { 
                opacity: 0, 
                y: 20,
                x: -10
            },
            visible: {
                opacity: 1,
                y: 0,
                x: 0,
                transition: { 
                    type: "spring", 
                    stiffness: 100,
                    damping: 12,
                    delay: index * 0.1 + 0.4,
                    duration: 0.7
                }
            }
        },
        
        // 2. Slide from side
        {
            hidden: { 
                opacity: 0, 
                x: index % 2 === 0 ? 30 : -30
            },
            visible: {
                opacity: 1,
                x: 0,
                transition: { 
                    type: "tween", 
                    ease: "easeOut",
                    delay: index * 0.1 + 0.35,
                    duration: 0.6
                }
            }
        },
        
        // 3. Fade up with slight scaling
        {
            hidden: { 
                opacity: 0, 
                y: 15,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 70,
                    delay: index * 0.1 + 0.45,
                    duration: 0.75
                }
            }
        }
    ];

    // ===== BUTTON ANIMATIONS: 3 variasi tombol =====
    const buttonVariants = [
        // 1. Slide up from bottom with bounce
        {
            hidden: { 
                opacity: 0, 
                y: 30,
                scale: 0.9
            },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.1 + 0.6,
                    duration: 0.7
                }
            },
            hover: !isMobile ? {
                scale: 1.05,
                y: -2,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                backgroundColor: "rgba(255,255,255,0.8)",
                transition: { duration: 0.2 }
            } : {}
        },
        
        // 2. Fade in with scale
        {
            hidden: { 
                opacity: 0, 
                scale: 0.7
            },
            visible: {
                opacity: 1,
                scale: 1,
                transition: { 
                    type: "spring", 
                    stiffness: 100,
                    delay: index * 0.1 + 0.7,
                    duration: 0.6
                }
            },
            hover: !isMobile ? {
                scale: 1.08,
                backgroundColor: "rgba(255,255,255,0.7)",
                transition: { duration: 0.2 }
            } : {}
        },
        
        // 3. Appear with slight tilt
        {
            hidden: { 
                opacity: 0, 
                rotate: index % 2 === 0 ? 5 : -5,
                y: 10
            },
            visible: {
                opacity: 1,
                rotate: 0,
                y: 0,
                transition: { 
                    type: "spring", 
                    stiffness: 120,
                    delay: index * 0.1 + 0.5,
                    duration: 0.8
                }
            },
            hover: !isMobile ? {
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.75)",
                transition: { duration: 0.3 }
            } : {}
        }
    ];

    // ===== Select variation based on index =====
    const selectedEntranceVariant = entranceVariants[getVariantType(index, entranceVariants.length)];
    const selectedIconVariant = iconVariants[getVariantType(index + 2, iconVariants.length)];
    const selectedTextVariant = textVariants[getVariantType(index + 1, textVariants.length)];
    const selectedButtonVariant = buttonVariants[getVariantType(index, buttonVariants.length)];

    // Special staggered text animation for description
    const getDescriptionAnimation = (sentenceIndex: number) => {
        const baseDelay = index * 0.1 + 0.5;
        const staggerDelay = 0.08;
        
        return {
            hidden: { opacity: 0, y: 10 },
            visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                    delay: baseDelay + (sentenceIndex * staggerDelay),
                    duration: 0.5,
                    ease: "easeOut"
                }
            }
        };
    };

    const handleClick = () => setSelectedStory(story);

    return (
        <motion.div
            ref={setRef}
            variants={selectedEntranceVariant}
            initial="hidden"
            animate={controls}
            onHoverStart={() => !isMobile && setIsHovered(true)}
            onHoverEnd={() => !isMobile && setIsHovered(false)}
            className={`relative ${story.color} rounded-3xl p-6 shadow-md transform ${isHovered && !isMobile ? 'shadow-lg' : ''}`}
            whileHover={!isMobile ? { 
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)',
                backgroundColor: story.hoverColor.split(' ')[1] || story.color,
                transition: { duration: 0.3 }
            } : undefined}
            style={{ 
                transformOrigin: getVariantType(index, 3) === 0 ? 'center' : 
                               getVariantType(index, 3) === 1 ? 'bottom' : 'top' 
            }}
        >
            {/* Unique background pattern based on index */}
            <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
                <div className="w-full h-full" style={{
                    backgroundImage: index % 3 === 0 
                        ? 'radial-gradient(circle, rgba(255,255,255,0.8) 8%, transparent 8%)'
                        : index % 3 === 1
                        ? 'linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)'
                        : 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 11px)',
                    backgroundSize: index % 3 === 0 ? '20px 20px' : index % 3 === 1 ? '15px 15px' : '20px 20px'
                }}></div>
            </div>
            
            {/* Icon and title section with unique animations */}
            <div className="flex items-center mb-6 space-x-4 relative z-10">
                <motion.div
                    variants={selectedIconVariant}
                    className="p-3 bg-white/30 rounded-full shadow-sm"
                >
                    <motion.div 
                        animate={isHovered && !isMobile ? { 
                            rotate: getVariantType(index, 3) === 0 ? 15 : getVariantType(index, 3) === 1 ? -12 : 8, 
                            scale: 1.08,
                            transition: { duration: 0.3, type: "spring" }
                        } : {}}
                    >
                        {story.icon}
                    </motion.div>
                </motion.div>
                <div>
                    <motion.h3 
                        variants={selectedTextVariant} 
                        className="text-2xl font-bold text-gray-800"
                    >
                        {story.title}
                    </motion.h3>
                    <motion.span 
                        variants={selectedTextVariant}
                        custom={1}
                        className="text-sm text-gray-600 inline-block"
                    >
                        {story.date}
                    </motion.span>
                </div>
            </div>
            
            {/* Description with staggered animation per sentence */}
            <div className="text-gray-700 leading-relaxed mb-16 relative z-10">
                {story.description.split('. ').map((sentence, i) => (
                    sentence.trim() && (
                        <motion.p 
                            key={i}
                            variants={getDescriptionAnimation(i)}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="mb-2"
                        >
                            {sentence.trim() + (i < story.description.split('. ').length - 1 ? '.' : '')}
                        </motion.p>
                    )
                ))}
            </div>
            
            {/* Button with adaptive animation and hover effect */}
            <motion.button
                onClick={handleClick}
                variants={selectedButtonVariant}
                whileHover="hover"
                whileTap={!isMobile ? { scale: 0.98 } : undefined}
                className="flex items-center space-x-2 absolute bottom-6 bg-white/40 text-gray-900 font-semibold py-2 px-4 rounded-full z-20"
            >
                <span>Baca Selengkapnya</span>
                <motion.div
                    animate={isHovered && !isMobile ? { 
                        x: getVariantType(index, 3) === 0 ? 5 : getVariantType(index, 3) === 1 ? 3 : 4,
                        transition: { type: "spring", stiffness: 200 }
                    } : { x: 0 }}
                >
                    <ChevronRight size={16} />
                </motion.div>
                
                {/* Adaptive hover indicator based on card variant */}
                {isHovered && !isMobile && (
                    <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="ml-1 text-xs flex items-center overflow-hidden"
                    >
                        <Eye size={12} className="mr-1" />
                        <span className="text-xs">Lihat</span>
                    </motion.div>
                )}
            </motion.button>
        </motion.div>
    );
});

export default StoryCard;