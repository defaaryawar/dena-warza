import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MemoryCard from './MemoryCardTerbaru';
import { Link } from 'react-router-dom';
import { Memory } from '../types/Memory';
import { useQuery, useQueryClient } from 'react-query';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const MemoryList: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const queryClient = useQueryClient();

    // Fungsi untuk membandingkan data cache dengan data baru
    const compareMemories = (cachedData: Memory[], newData: Memory[]): boolean => {
        if (cachedData.length !== newData.length) return true; // Jika panjang berbeda, data berubah
        return newData.some((memory, index) => memory.updatedAt !== cachedData[index]?.updatedAt);
    };

    // Menggunakan useQuery dari react-query untuk fetch dan cache data
    const {
        data: memories,
        isLoading: loading,
        error,
    } = useQuery<Memory[], Error>(
        ['latest_memories', API_URL], // Key untuk query
        async () => {
            const response = await fetch(`${API_URL}/api/memories`);
            if (!response.ok) throw new Error('Failed to fetch data');
            return response.json();
        },
        {
            staleTime: 120 * 60 * 1000, // Data dianggap fresh selama 2 jam
            cacheTime: 120 * 60 * 1000, // Data disimpan di cache selama 2 jam
            refetchOnWindowFocus: false, // Tidak refetch saat window focus
            refetchOnReconnect: false, // Tidak refetch saat reconnect
            refetchOnMount: false, // Tidak refetch saat komponen di-mount ulang
            select: (newData) => {
                // Dapatkan data cache saat ini
                const cachedData = queryClient.getQueryData<Memory[]>(['latest_memories', API_URL]);

                // Jika tidak ada data cache, kembalikan data baru
                if (!cachedData) return newData;

                // Bandingkan data cache dengan data baru
                const isDataChanged = compareMemories(cachedData, newData);

                // Jika data tidak berubah, kembalikan data cache
                if (!isDataChanged) return cachedData;

                // Jika data berubah, kembalikan data baru
                return newData;
            }
        }
    );

    // Urutkan data berdasarkan tanggal terbaru dan ambil 10 data terbaru
    const latestMemories = useMemo(() => {
        if (!memories) return [];
        return memories
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10); // Ambil 10 data terbaru
    }, [memories]);

    // Fungsi untuk memeriksa apakah scroll bisa dilakukan
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

    // Fungsi untuk melakukan scroll
    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const { clientWidth } = scrollRef.current;
        const scrollAmount = window.innerWidth < 640 ? clientWidth * 0.8 : clientWidth * 0.4;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(checkScrollability, 300);
    };

    // Loading state
    if (loading) return (
        <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Error state
    if (error) return (
        <div className="min-h-[300px] flex items-center justify-center text-red-500">
            {error.message}
        </div>
    );

    return (
        <div className="relative group px-4 sm:px-6 md:px-8">
            {/* Title Section */}
            <div className="flex items-center justify-between mb-0">
                <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                    Kenangan Terbaru
                </h2>
                <Link to="galleryall"
                    className="text-blue-600 font-semibold underline cursor-pointer text-xs z-100">
                    Lihat lebih banyak
                </Link>
            </div>

            {/* Gradient overlays untuk scroll indicators */}
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

            {/* Scroll buttons */}
            {canScrollLeft && (
                <div className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 sm:p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-lg 
                                 hover:bg-gray-50 hover:scale-105 transition-all duration-300
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="text-gray-600 group-hover:text-gray-800 transition-colors w-4 h-4 sm:w-6 sm:h-6" />
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
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="text-gray-600 group-hover:text-gray-800 transition-colors w-4 h-4 sm:w-6 sm:h-6" />
                    </button>
                </div>
            )}

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-2 no-scrollbar py-4 sm:py-6"
            >
                {latestMemories.length > 0 ? (
                    latestMemories.map(memory => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            className="flex-shrink-0 w-[200px] sm:w-[250px] md:w-[270px] lg:w-[300px]"
                        />
                    ))
                ) : (
                    <div className="w-full text-center py-8 text-gray-500">
                        Belum ada kenangan tersimpan
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryList;