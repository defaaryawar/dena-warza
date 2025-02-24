import React, { useEffect, useMemo, useState } from 'react';
import { useIsMobile } from '../../hooks/isMobile';

interface CountdownProps {
    targetDate: string;
    label: string;
    delay: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, label, delay }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const timeLeft = useMemo(() => {
        const difference = +new Date(targetDate) - +new Date();
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return `${days} hari`;
    }, [targetDate]);

    return (
        <div
            className={`text-center flex-1 transition-all duration-700 transform cursor-default
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'}
                ${!isMobile && isHovered ? 'scale-105' : 'scale-100'}`}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
        >
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {timeLeft}
            </div>
            <div className="text-sm md:text-base text-gray-600">{label}</div>
        </div>
    );
};

export default Countdown;