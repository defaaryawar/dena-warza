import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryCard from './MemoryCardTerbaru';
import { useNavigate } from 'react-router-dom';
import { Memory } from '../types/Memory';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { useIsMobile } from '../hooks/isMobile';
import { supabase } from '../services/supabaseClient';

const MemoryList: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const handleFetchError = (error: Error) => {
        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            return [];
        }
    
        toast.error(`Gagal memuat kenangan: ${error.message}`);
        return [];
    };
    

    const {
        data: memories,
        isLoading: loading,
        error,
        refetch
    } = useQuery<Memory[], Error>(
        ['latest_memories'],
        async () => {
            try {
                console.log('Fetching memories from Supabase');
                
                // Directly query the Memory table from Supabase
                const { data, error } = await supabase
                    .from('Memory')
                    .select('*')
                    .order('date', { ascending: false });
                
                // Log the results for debugging
                console.log('Supabase response:', { data, error });
                
                if (error) {
                    throw new Error(error.message);
                }
                
                return data || [];
            } catch (err) {
                console.error('Error fetching memories:', err);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };

    const getCardDimensions = () => {
        if (isMobile) {
            return "w-[calc(100vw-3rem)] max-w-[300px] min-h-[250px]";
        }
        return "w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] xl:w-[360px] min-h-[300px] sm:min-h-[320px] md:min-h-[340px]";
    };

    // Loading state with enhanced typography
    if (loading) return (
        <div className="min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-4 sm:py-6">
                {[...Array(isMobile ? 1 : 4)].map((_, index) => (
                    <div
                        key={index}
                        className={`${getCardDimensions()} bg-gray-200 rounded-xl relative overflow-hidden mx-auto`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
                        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-white/70 backdrop-blur-sm p-4">
                            <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4 mb-3 animate-pulse" />
                            <div className="h-4 sm:h-5 bg-gray-300 rounded w-1/2 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Error state with improved typography
    if (error) return (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-red-500 p-4 text-center">
            {!isMobile ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <AlertTriangle className="w-12 h-12 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3">Gagal Memuat Kenangan</h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-4">
                        {error.message || 'Terjadi kesalahan saat memuat kenangan'}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-blue-500 text-white text-base sm:text-lg rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Coba Lagi
                    </motion.button>
                </motion.div>
            ) : (
                <div className="flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Gagal Memuat Kenangan</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {error.message || 'Terjadi kesalahan saat memuat kenangan'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg active:bg-blue-600"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}
        </div>
    );

    // Main component render with enhanced typography
    const ContentWrapper = isMobile ? 'div' : motion.div;

    return (
        <ContentWrapper
            className="relative group px-4 sm:px-6 md:px-8"
            {...(!isMobile && {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
            })}
        >
            {/* Scroll Indicators remain the same */}
            {!isMobile && (
                <AnimatePresence>
                    {canScrollLeft && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -left-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
                            }}
                        />
                    )}

                    {canScrollRight && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -right-0.5 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
                            }}
                        />
                    )}
                </AnimatePresence>
            )}

            {/* Enhanced scroll buttons */}
            {!isMobile && (
                <>
                    {canScrollLeft && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                        >
                            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                        </motion.button>
                    )}

                    {canScrollRight && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                        >
                            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                        </motion.button>
                    )}
                </>
            )}

            {/* Memory Cards Container with improved spacing */}
            <div
                ref={scrollRef}
                className={`
                    flex gap-4 sm:gap-3 overflow-x-auto scroll-smooth px-2 py-4 sm:py-6 no-scrollbar
                    ${isMobile ? 'snap-x snap-mandatory' : ''}
                `}
            >
                {latestMemories.length > 0 ? (
                    latestMemories.map(memory => {
                        const CardWrapper = isMobile ? 'div' : motion.div;

                        return (
                            <CardWrapper
                                key={memory.id}
                                className={`
                                    flex-shrink-0 ${getCardDimensions()}
                                    ${isMobile ? 'snap-center' : ''}
                                `}
                                {...(!isMobile && {
                                    variants: cardVariants,
                                    whileHover: "hover"
                                })}
                            >
                                <MemoryCard
                                    memory={memory}
                                    className="w-full h-full transition-all duration-300"
                                    isLoading={loading}
                                />
                            </CardWrapper>
                        );
                    })
                ) : (
                    <div className="w-full text-center py-8 text-base sm:text-lg text-gray-800 font-medium">
                        Belum ada kenangan tersimpan
                    </div>
                )}
            </div>
        </ContentWrapper>
    );
};

export default MemoryList;