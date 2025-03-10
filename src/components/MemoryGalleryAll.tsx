import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, AlertTriangle, Sparkles } from 'lucide-react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import MemoryCard from './MemoryCardTerbaru';
import { Memory } from '../types/Memory';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { supabase } from '../services/supabaseClient';

const MemoryGalleryAll: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(8);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Responsive breakpoints
    const isMobile = windowWidth < 768;
    const isSmallMobile = windowWidth < 380;

    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Scroll progress indicator
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        data: memories,
        isLoading: loading,
        error,
        refetch: refresh
    } = useQuery<Memory[], Error>(
        ['memories'],
        async () => {
            console.log('Attempting to fetch memories...');
            const { data, error } = await supabase
                .from('Memory')
                .select('*')
                .order('date', { ascending: false });
    
            if (error) {
                console.error('Supabase error:', error);
                throw new Error(`Fetch error: ${error.message}`);
            }
    
            if (!data) {
                throw new Error('No data returned from Supabase');
            }
    
            return data;
        },
        {
            retry: 1,
            refetchOnWindowFocus: false,
            onError: (err: Error) => {
                console.error('Query error:', err);
                toast.error(`Gagal memuat data: ${err.message}`);
            }
        }
    );

    useEffect(() => {
        const testConnection = async () => {
            console.log('Testing Supabase connection...');
            try {
                const { data, error } = await supabase
                    .from('Memory')
                    .select('*')
                    .limit(1);
    
                if (error) {
                    console.error('Supabase connection error:', error);
                } else {
                    console.log('Supabase connection successful:', data);
                }
            } catch (e) {
                console.error('Connection test error:', e);
            }
        };
    
        testConnection();
    }, []);

    // Sort memories by date
    const sortedMemories = useMemo(() => {
        if (!memories || !memories.length) return [];
        return [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [memories]);

    // Get unique and sorted tags
    const allTags = useMemo(() => {
        if (!sortedMemories.length) return [];
        const tags = Array.from(new Set(sortedMemories.flatMap(memory => memory.tags || [])));
        return tags.sort((a, b) => a.localeCompare(b));
    }, [sortedMemories]);

    // Filter memories based on search term and selected tags
    const filteredMemories = useMemo(() => {
        if (!sortedMemories.length) return [];
        return sortedMemories.filter(memory => {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !normalizedSearchTerm ||
                memory.title.toLowerCase().includes(normalizedSearchTerm) ||
                (memory.description && memory.description.toLowerCase().includes(normalizedSearchTerm)) ||
                (memory.tags && memory.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm)));

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some(tag => memory.tags?.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [sortedMemories, searchTerm, selectedTags]);

    // Memories to display based on display count
    const displayedMemories = useMemo(() =>
        filteredMemories.slice(0, displayCount),
        [filteredMemories, displayCount]
    );

    // Event handlers
    const handleTagToggle = useCallback((tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        setDisplayCount(8);
    }, []);

    const handleLoadMore = useCallback(() => setDisplayCount(prev => prev + 8), []);

    const clearAllFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedTags([]);
        setDisplayCount(8);
    }, []);

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDisplayCount(8);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const filterVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 200
            }
        }
    };

    // Enhanced loading state
    if (loading) return (
        <motion.div
            className="min-h-screen flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="text-center"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 360]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full 
                            animate-spin mx-auto mb-6 shadow-lg">
                </div>
                <motion.p
                    className="text-gray-600 text-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Memuat kenangan indah Anda...
                </motion.p>
            </motion.div>
        </motion.div>
    );

    // Error state
    if (error && !sortedMemories?.length) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-500">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <p className="text-xl font-semibold mb-2">Gagal Memuat Kenangan</p>
                <p className="text-sm text-gray-600">{error.message}</p>
                <button
                    onClick={() => refresh()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-blue-500 transform-origin-0 z-50"
                style={{ scaleX }}
            />

            <motion.div
                className="mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Search and Filter Section */}
                <motion.div
                    className={`bg-white rounded-lg shadow-lg px-3 py-3 mb-4 space-y-4 sticky 
                ${isMobile ? 'top-20' : 'top-20'} z-10 mx-0
                transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Search Input */}
                        <motion.div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder={isSmallMobile ? "Cari kenangan..." : "Cari kenangan berdasarkan judul, deskripsi, atau tag..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-300 ease-in-out text-gray-700 bg-gray-50
                            placeholder:text-gray-400 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

                            {searchTerm && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Filter Toggle Button */}
                        <motion.button
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className={`px-4 py-3 rounded-lg border-2 transition-all duration-300
                            flex items-center justify-center gap-2 text-sm font-medium
                            ${isFilterExpanded
                                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700'}`}
                        >
                            <Filter className={`w-5 h-5 ${isFilterExpanded ? 'text-blue-500' : ''}`} />
                            {!isSmallMobile && "Filter"}
                            <ChevronDown className={`w-5 h-5 transform transition-transform duration-300 
                            ${isFilterExpanded ? 'rotate-180' : ''}`} />
                        </motion.button>
                    </div>

                    {/* Filter Tags Section */}
                    <AnimatePresence>
                        {isFilterExpanded && (
                            <motion.div
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                            >
                                <div className="flex flex-wrap justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                        Filter Tag
                                    </h3>

                                    {(searchTerm || selectedTags.length > 0) && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-red-500 text-sm hover:text-red-700 
                                        flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4" />
                                            Hapus
                                        </button>
                                    )}
                                </div>

                                {/* Tag buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium
                                            transition-all duration-300 ease-in-out
                                            ${selectedTags.includes(tag)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-200'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Filters Display */}
                    <AnimatePresence>
                        {(selectedTags.length > 0 || searchTerm) && (
                            <motion.div
                                className="flex flex-wrap gap-2 pt-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {selectedTags.map(tag => (
                                    <motion.div
                                        key={tag}
                                        className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 
                                            rounded-md text-xs font-medium border border-blue-100"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => handleTagToggle(tag)}
                                            className="ml-1 hover:text-blue-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}

                                {searchTerm && (
                                    <motion.div
                                        className="flex items-center bg-gray-50 text-gray-700 px-2 py-1 
                                    rounded-md text-xs font-medium border border-gray-200"
                                    >
                                        {isSmallMobile ? searchTerm : `Pencarian: "${searchTerm}"`}
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="ml-1 hover:text-gray-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Memory Cards Grid */}
                <div className={`px-2 grid gap-3 ${isMobile
                    ? 'grid-cols-1'
                    : windowWidth < 1024
                        ? 'grid-cols-2'
                        : windowWidth < 1280
                            ? 'grid-cols-3'
                            : 'grid-cols-4'
                    }`}>
                    <AnimatePresence mode="wait">
                        {displayedMemories.length > 0 ? (
                            displayedMemories.map((memory) => (
                                <motion.div
                                    key={memory.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="w-full"
                                >
                                    <MemoryCard
                                        memory={memory}
                                        className="w-full h-full"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="col-span-full text-center py-8 bg-gray-50 rounded-lg mx-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-lg font-semibold text-gray-700">
                                    Tidak ada kenangan ditemukan
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Coba sesuaikan pencarian atau filter
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Load More Button */}
                {displayedMemories.length < filteredMemories.length && (
                    <motion.div className="flex justify-center mt-6 mb-4 px-2">
                        <button
                            onClick={handleLoadMore}
                            className="w-full bg-white text-blue-600 border-2 border-blue-600 
                                rounded-lg py-3 px-4 font-medium text-sm
                                active:bg-blue-50 transition-colors"
                        >
                            Muat Lebih Banyak
                        </button>
                    </motion.div>
                )}

                {/* Scroll to Top Button */}
                <AnimatePresence>
                    {scrolled && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 
                                rounded-full shadow-lg z-50"
                        >
                            <ChevronUp className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default React.memo(MemoryGalleryAll);