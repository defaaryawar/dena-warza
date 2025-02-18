import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Calendar, Heart, Tag, GridIcon, List, Settings2, X, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Memory } from '../types/Memory';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/isMobile'; // Import hook useIsMobile

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SearchMemories = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [selectedDate, setSelectedDate] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const queryClient = useQueryClient();
    const isMobile = useIsMobile(); // Gunakan hook useIsMobile

    // Enhanced error handling function
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

    // Fetch memories with comprehensive error handling
    const {
        data: memories,
        isLoading: loading,
        error,
        refetch
    } = useQuery<Memory[], Error>(
        ['search_memories', API_URL],
        async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                throw new Error('No authentication token found');
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
                const cachedData = queryClient.getQueryData<Memory[]>(['search_memories', API_URL]);

                if (!cachedData) return newData;

                const isDataChanged = JSON.stringify(cachedData) !== JSON.stringify(newData);

                return isDataChanged ? newData : cachedData;
            }
        }
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', closeDropdown);
        }

        return () => document.removeEventListener('mousedown', closeDropdown);
    }, [isDropdownOpen]);

    // Filter dan sort data
    const filteredMemories = useMemo(() => {
        if (!memories) return [];

        let filtered = [...memories];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(memory =>
                memory.title.toLowerCase().includes(query) ||
                memory.description.toLowerCase().includes(query) ||
                memory.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        if (selectedDate) {
            filtered = filtered.filter(memory => memory.date.startsWith(selectedDate));
        }

        return filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortBy === 'newest' ?
                dateB.getTime() - dateA.getTime() :
                dateA.getTime() - dateB.getTime();
        });
    }, [memories, searchQuery, selectedDate, sortBy]);

    // Loading state with Framer Motion
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat kenangan...</p>
            </motion.div>
        </div>
    );

    // Error state with Framer Motion
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-red-500"
            >
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <p className="text-xl font-semibold mb-2">Gagal Memuat Kenangan</p>
                <p className="text-sm text-gray-600">{error.message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Coba Lagi
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-7xl md:px-6 px-4">
            {/* Search Bar and Filters */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-lg rounded-xl mb-8 sticky top-4 z-50 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
                <div className="container mx-auto py-4 relative">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: isMobile ? 1 : 1.1 }} // Nonaktifkan hover di mobile
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/50 rounded-full transition-all group cursor-pointer"
                        >
                            <ArrowLeft className="text-gray-600 group-hover:scale-110 transition-transform" size={24} />
                        </motion.button>

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari kenangan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-full hidden md:flex">
                            <motion.button
                                whileHover={{ scale: isMobile ? 1 : 1.1 }} // Nonaktifkan hover di mobile
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'grid'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <GridIcon size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: isMobile ? 1 : 1.1 }} // Nonaktifkan hover di mobile
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-full transition-all cursor-pointer ${viewMode === 'list'
                                    ? 'bg-white text-blue-600 shadow'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <List size={18} />
                            </motion.button>
                        </div>

                        {/* Filter Button with Dropdown */}
                        <div className="relative dropdown-container">
                            <motion.button
                                whileHover={{ scale: isMobile ? 1 : 1.1 }} // Nonaktifkan hover di mobile
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`p-2 rounded-full cursor-pointer overflow-hidden transition-all duration-500 ${isDropdownOpen ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <span className={`flex items-center justify-center transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'
                                    }`}>
                                    {isDropdownOpen ? (
                                        <X className='h-5 w-5 text-blue-600' />
                                    ) : (
                                        <Settings2 className="w-5 h-5 text-gray-600" />
                                    )}
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="fixed mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                        style={{
                                            top: '4rem',
                                            right: '1rem'
                                        }}
                                    >
                                        <div className="p-4 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-gray-700">Filter & Sort</h3>
                                            </div>

                                            {/* Filter by Date */}
                                            <div>
                                                <h3 className="font-medium mb-2 text-gray-700">Filter by Date</h3>
                                                <div className="relative cursor-pointer">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        type="month"
                                                        value={selectedDate}
                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sort Order */}
                                            <div>
                                                <h3 className="font-medium mb-2 text-gray-700">Sort Order</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: isMobile ? 1 : 1.05 }} // Nonaktifkan hover di mobile
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSortBy('newest');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${sortBy === 'newest'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        Terbaru
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: isMobile ? 1 : 1.05 }} // Nonaktifkan hover di mobile
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSortBy('oldest');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${sortBy === 'oldest'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        Terlama
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-center"
            >
                <p className="text-gray-600">
                    {searchQuery ?
                        `Ditemukan ${filteredMemories.length} kenangan untuk "${searchQuery}"` :
                        `Menampilkan ${filteredMemories.length} kenangan`
                    }
                </p>
            </motion.div>

            {/* Search Results Grid/List View */}
            <motion.div
                className={`${viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-3.5 gap-2'
                    : 'space-y-4'
                    }`}
            >
                {filteredMemories.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        onClick={() => navigate(`/memory/${memory.id}`)}
                        className={`group bg-white rounded-xl overflow-hidden shadow-sm ${!isMobile ? 'md:hover:shadow-xl' : ''} transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex items-center' : ''
                            }`}
                    >
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48' : ''}`}>
                            {memory.media && memory.media[0] && (
                                <motion.img
                                    src={memory.media[0].url}
                                    alt={memory.title}
                                    className={`${viewMode === 'grid'
                                        ? 'w-full md:h-48 h-32'
                                        : 'w-48 h-36'
                                        } object-cover transform ${!isMobile ? 'md:group-hover:scale-105' : ''} transition-transform duration-300`}
                                    whileHover={{ scale: isMobile ? 1 : 1.05 }} // Nonaktifkan hover di mobile
                                />
                            )}
                        </div>
                        <div className="md:p-4 p-2 flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold md:text-lg text-xs text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 bg-clip-text transition-colors">
                                    {memory.title}
                                </h3>
                                <Heart className="text-pink-500 transition-opacity" size={18} />
                            </div>
                            <p className="text-gray-600 md:text-sm text-[9px] mb-3">{memory.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {memory.tags.map((tag, index) => (
                                    <motion.span
                                        key={index}
                                        whileHover={{ scale: isMobile ? 1 : 1.1 }} // Nonaktifkan hover di mobile
                                        className="inline-flex items-center gap-1 md:px-2 md:py-1 px-1 py-0.5 md:text-xs text-[9px] rounded-full bg-blue-50 text-blue-600 transition-colors"
                                    >
                                        <Tag className='md:w-3 md:h-3 h-2 w-2' />
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {filteredMemories.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl p-8 text-center shadow-sm"
                >
                    <div className="max-w-sm mx-auto">
                        <div className="mb-6 relative">
                            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                                <Search className="text-blue-500" size={32} />
                            </div>
                            <div className="absolute -bottom-2 right-1/3 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <Heart className="text-pink-500" size={16} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            Tidak ada kenangan ditemukan
                        </h3>
                        <p className="text-gray-600">
                            Tidak ada memories yang cocok dengan "{searchQuery}". Coba kata kunci lain?
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
export default SearchMemories;