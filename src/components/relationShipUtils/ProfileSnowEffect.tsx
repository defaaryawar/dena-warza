import React from 'react';
import { motion } from 'framer-motion';

interface ProfileSnowEffectProps {
    className?: string;
}

const ProfileSnowEffect: React.FC<ProfileSnowEffectProps> = ({ className }) => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {Array.from({ length: 15 }).map((_, index) => (
            <motion.div
                key={index}
                className="absolute w-1 h-1 bg-white rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: 100,
                }}
                transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 2,
                }}
            />
        ))}
    </div>
);

export default ProfileSnowEffect;