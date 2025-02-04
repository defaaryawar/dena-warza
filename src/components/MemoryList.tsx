import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MemoryCard from './MemoryCard';
import { Memory } from '../types/Memory';

const MemoryList: React.FC<{ memories: Memory[] }> = ({ memories }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Fungsi untuk memeriksa kemampuan scroll
    const checkScrollability = () => {
        if (scrollRef.current) {
            const { clientWidth, scrollWidth, scrollLeft } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    // Gunakan useEffect untuk memeriksa scroll pertama kali dan saat resize
    useEffect(() => {
        checkScrollability();

        const handleResize = () => checkScrollability();
        window.addEventListener('resize', handleResize);

        // Tambahkan event listener untuk scroll
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

    // Fungsi scroll dengan logika yang lebih baik
    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const { clientWidth } = scrollRef.current;
        // Kurangi sedikit scroll amount agar tidak langsung mentok
        const scrollAmount = clientWidth * 0.4;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        // Tunggu sedikit untuk memastikan scroll selesai
        setTimeout(checkScrollability, 300);
    };

    return (
        <div className="relative group">
            {/* Gradient Overlay Kiri */}
            {canScrollLeft && (
                <div
                    className="absolute -left-0.5 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}
            <p className='text-black font-medium text-lg'>kenangan Terbaru</p>
            {/* Gradient Overlay Kanan */}
            {canScrollRight && (
                <div
                    className="absolute -right-0.5 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {/* Tombol Scroll Kiri */}
            {canScrollLeft && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all group duration-300"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft
                            className="text-gray-600 cursor-pointer group-hover:text-gray-800 transition-colors"
                            size={24}
                        />
                    </button>
                </div>
            )}

            {/* Tombol Scroll Kanan */}
            {canScrollRight && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all group duration-300"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight
                            className="text-gray-600 cursor-pointer group-hover:text-gray-800 transition-colors"
                            size={24}
                        />
                    </button>
                </div>
            )}

            {/* Kontainer Gulir */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-2 py-6"
            >
                {memories.map(memory => (
                    <MemoryCard
                        key={memory.id}
                        memory={memory}
                        className="flex-shrink-0 w-full sm:w-80 md:w-96 lg:w-[calc(25%-1rem)]"
                    />
                ))}
            </div>
        </div>
    );
};

export default MemoryList;