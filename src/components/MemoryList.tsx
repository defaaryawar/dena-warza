import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MemoryCard from './MemoryCard';
import { Memory } from '../types/Memory';

const MemoryList: React.FC<{ memories: Memory[] }> = ({ memories }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollability = () => {
        if (scrollRef.current) {
            const { clientWidth, scrollWidth, scrollLeft } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    useEffect(() => {
        checkScrollability();

        const handleResize = () => {
            checkScrollability();
        };

        window.addEventListener('resize', handleResize);
        const currentScrollRef = scrollRef.current;

        if (currentScrollRef) {
            currentScrollRef.addEventListener('scroll', checkScrollability);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentScrollRef) {
                currentScrollRef.removeEventListener('scroll', checkScrollability);
            }
        };
    }, [memories]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const { clientWidth } = scrollRef.current;
        // Adjust scroll amount based on screen size
        const scrollAmount = window.innerWidth < 640 ? clientWidth * 0.8 : clientWidth * 0.4;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(checkScrollability, 300);
    };

    return (
        <div className="relative group px-4 sm:px-6 md:px-8">
            {/* Title Section */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                    Kenangan Terbaru
                </h2>
                {/* Optional: Add view all button here */}
            </div>

            {/* Gradient overlays with responsive widths */}
            {canScrollLeft && (
                <div
                    className="absolute -left-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {canScrollRight && (
                <div
                    className="absolute -right-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {/* Scroll buttons with responsive positioning and sizing */}
            {canScrollLeft && (
                <div className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 sm:p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg 
                        hover:bg-gray-50 hover:scale-105 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft
                            className="text-gray-600 group-hover:text-gray-800 transition-colors w-4 h-4 sm:w-6 sm:h-6"
                        />
                    </button>
                </div>
            )}

            {canScrollRight && (
                <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 sm:p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg 
                        hover:bg-gray-50 hover:scale-105 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight
                            className="text-gray-600 group-hover:text-gray-800 transition-colors w-4 h-4 sm:w-6 sm:h-6"
                        />
                    </button>
                </div>
            )}

            {/* Scrollable container with responsive card sizes */}
            <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-2 no-scrollbar py-4 sm:py-6"
            >
                {memories.map(memory => (
                    <MemoryCard
                        key={memory.id}
                        memory={memory}
                        className="flex-shrink-0 w-[200px] sm:w-[250px] md:w-[270px] lg:w-[300px]"
                    />
                ))}
            </div>
        </div>
    );
};

export default MemoryList;