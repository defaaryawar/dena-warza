import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import MemoryCard from './MemoryCardTerbaru';
import { useNavigate } from 'react-router-dom';
import { Memory } from '../types/Memory';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const MemoryList: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleFetchError = (error: Error) => {
        if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')) {
            sessionStorage.removeItem('authToken');
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
            navigate('/login');
            return null;
        }

        if (error.message.includes('500')) {
            toast.error('Terjadi kesalahan server. Silakan coba lagi nanti.');
            return null;
        }

        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            return null;
        }

        toast.error(`Gagal memuat kenangan: ${error.message}`);
        return null;
    };

    const compareMemories = (cachedData: Memory[], newData: Memory[]): boolean => {
        if (cachedData.length !== newData.length) return true;
        return newData.some((memory, index) => memory.updatedAt !== cachedData[index]?.updatedAt);
    };

    const {
        data: memories,
        isLoading: loading,
        error,
        refetch
    } = useQuery<Memory[], Error>(
        ['latest_memories', API_URL],
        async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                navigate('/pin', { replace: true });
                return null;
            }

            try {
                const response = await fetch(`${API_URL}/api/memories`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                return response.json();
            } catch (err) {
                return handleFetchError(err as Error);
            }
        },
        {
            staleTime: 120 * 60 * 1000,
            cacheTime: 120 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            onError: (err: Error) => {
                handleFetchError(err);
            },
            select: (newData) => {
                const cachedData = queryClient.getQueryData<Memory[]>(['latest_memories', API_URL]);

                if (!cachedData) return newData;

                const isDataChanged = compareMemories(cachedData, newData);

                return isDataChanged ? newData : cachedData;
            }
        }
    );

    const latestMemories = useMemo(() => {
        if (!memories) return [];
        return memories
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    }, [memories]);

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
        const scrollAmount = window.innerWidth < 640 ? clientWidth * 0.8 : clientWidth * 0.4;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(checkScrollability, 300);
    };

    // Enhanced Loading state with gradient animation
    if (loading) return (
        <div className="min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-2 py-4 sm:py-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-[gradientShift_2s_infinite]" />
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-sm p-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-red-500 p-4 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Gagal Memuat Kenangan</h3>
            <p className="text-sm text-gray-600 mb-4">
                {error.message || 'Terjadi kesalahan saat memuat kenangan'}
            </p>
            <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Coba Lagi
            </button>
        </div>
    );

    return (
        <div className="relative group px-4 sm:px-6 md:px-8">
            {/* Smooth gradient overlays */}
            {canScrollLeft && (
                <div
                    className="absolute -left-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {canScrollRight && (
                <div
                    className="absolute -right-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(to left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {/* Enhanced scroll buttons with smooth transitions */}
            {canScrollLeft && (
                <div className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out -translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md
                                 sm:hover:bg-white sm:hover:shadow-lg sm:hover:scale-105
                                 transition-all duration-300 ease-in-out
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 sm:group-hover:-translate-x-0.5" />
                    </button>
                </div>
            )}

            {canScrollRight && (
                <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md
                                 sm:hover:bg-white sm:hover:shadow-lg sm:hover:scale-105
                                 transition-all duration-300 ease-in-out
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 sm:group-hover:translate-x-0.5" />
                    </button>
                </div>
            )}

            {/* Scrollable container with smooth scroll behavior */}
            <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-2 no-scrollbar py-4 sm:py-6 transition-all duration-300"
            >
                {latestMemories.length > 0 ? (
                    latestMemories.map(memory => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            className="flex-shrink-0 w-[200px] sm:w-[250px] md:w-[270px] lg:w-[300px] md:min-h-[370px] min-h-[303px] transition-transform duration-300"
                            isLoading={loading}
                        />
                    ))
                ) : (
                    <div className="w-full text-center md:py-8 py-6 text-gray-800">
                        Belum ada kenangan tersimpan
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryList;