import { motion, AnimatePresence } from 'framer-motion' 

export interface Version {
    id: string;
    title: string;
    description: string;
    icon: JSX.Element;
    bgColor: string;
    borderColor: string;
    component: React.ComponentType;
}

// Animation variants
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
};

export const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

export const cardVariants = {
    hidden: (i: number) => ({ opacity: 0, y: 50, x: i % 2 === 0 ? -20 : 20 }),
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 14
        }
    },
    hover: {
        y: -8,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    },
    tap: { scale: 0.98 }
};

export const iconVariants = {
    visible: { rotate: 0, scale: 1 },
    hover: {
        rotate: [0, -10, 10, 0],
        scale: 1.2,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10
        }
    }
};

export const arrowVariants = {
    visible: { x: 0, opacity: 0.6 },
    hover: {
        x: 5,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10
        }
    }
};

export const selectedComponentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.3 }
    }
};

export interface AnimatedTextProps {
    text: string;
    className?: string;
}

// Custom Animation Components
export const AnimatedText = ({ text, className = '' }: AnimatedTextProps): JSX.Element => {
    return (
        <motion.p
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay: 0.5
                }
            }}
        >
            {text}
        </motion.p>
    );
};

export const CardSparkles = ({ isVisible }: { isVisible: boolean }): JSX.Element => {
    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 200 - 100,
                            }}
                            transition={{
                                duration: 1.5,
                                delay: Math.random() * 0.5,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 2
                            }}
                            className="absolute w-1 h-1 rounded-full bg-white"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`
                            }}
                        />
                    ))}
                </>
            )}
        </AnimatePresence>
    );
};

// Subtle moving background particles
export const Particles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10 backdrop-blur-md"
                    style={{
                        width: `${Math.random() * 30 + 10}px`,
                        height: `${Math.random() * 30 + 10}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0.1 }}
                    animate={{
                        x: [
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50
                        ],
                        y: [
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50
                        ],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}
        </div>
    );
};