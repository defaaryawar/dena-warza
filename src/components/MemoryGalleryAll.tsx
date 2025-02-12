import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import MemoryCard from './MemoryCardTerbaru';
import { Memory } from '../types/Memory';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const MemoryGalleryAll: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(8);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Enhanced error handling function
    const handleFetchError = (error: Error) => {
        if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')) {
            sessionStorage.removeItem('authToken');
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
            navigate('/pin', { replace: true });
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

    // Fungsi untuk membandingkan data cache dengan data baru
    const compareMemories = (cachedData: Memory[], newData: Memory[]): boolean => {
        if (cachedData.length !== newData.length) return true;
        return newData.some((memory, index) => memory.updatedAt !== cachedData[index]?.updatedAt);
    };

    // Fetch memories with comprehensive error handling
    const {
        data: memories,
        isLoading: loading,
        error,
        refetch: refresh
    } = useQuery<Memory[], Error>(
        ['memories', API_URL],
        async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await fetch(`${API_URL}/api/memories`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
                const cachedData = queryClient.getQueryData<Memory[]>(['memories', API_URL]);

                if (!cachedData) return newData;

                const isDataChanged = compareMemories(cachedData, newData);

                return isDataChanged ? newData : cachedData;
            }
        }
    );

    // Urutkan data berdasarkan tanggal terbaru
    const sortedMemories = useMemo(() => {
        if (!memories) return [];
        return memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [memories]);

    // Mendapatkan semua tags yang unik dan diurutkan
    const allTags = useMemo(() => {
        if (!sortedMemories) return [];
        const tags = Array.from(new Set(sortedMemories.flatMap(memory => memory.tags || [])));
        return tags.sort((a, b) => a.localeCompare(b));
    }, [sortedMemories]);

    // Filter memories berdasarkan search term dan selected tags
    const filteredMemories = useMemo(() => {
        if (!sortedMemories) return [];
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

    // Memories yang ditampilkan berdasarkan display count
    const displayedMemories = useMemo(() =>
        filteredMemories.slice(0, displayCount),
        [filteredMemories, displayCount]
    );

    // Event handlers
    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        setDisplayCount(8);
    };

    const handleLoadMore = () => setDisplayCount(prev => prev + 8);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setDisplayCount(8);
    };

    // Loading state
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat kenangan...</p>
            </div>
        </div>
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
        <div className="container mx-auto px-0 py-8">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Cari kenangan berdasarkan judul, deskripsi, atau tag..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setDisplayCount(8);
                            }}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    transition-all duration-300 ease-in-out text-gray-700 bg-gray-50
                                    placeholder:text-gray-400"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                        text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                flex items-center justify-center gap-2 font-medium
                                ${isFilterExpanded
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600'}`}
                    >
                        <Filter className={`w-5 h-5 ${isFilterExpanded ? 'text-blue-500' : ''}`} />
                        Filter
                        {isFilterExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {/* Filter Tags Section */}
                {isFilterExpanded && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-inner">
                        <div className="flex flex-wrap justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Filter berdasarkan Tag</h3>
                            {(searchTerm || selectedTags.length > 0) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-red-500 hover:text-red-700 transition-colors
                                            flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" />
                                    Hapus Semua
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                                            transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-0.5
                                            ${selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
                                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {(selectedTags.length > 0 || searchTerm) && (
                    <div className="flex flex-wrap gap-3 pt-4">
                        {selectedTags.map(tag => (
                            <div key={tag} className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 
                                                    rounded-lg text-sm font-medium shadow-sm border border-blue-100">
                                {tag}
                                <button onClick={() => handleTagToggle(tag)} className="ml-2 hover:text-blue-900">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {searchTerm && (
                            <div className="flex items-center bg-gray-50 text-gray-700 px-4 py-2 
                                rounded-lg text-sm font-medium shadow-sm border border-gray-200">
                                Pencarian: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-gray-900">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Memory Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedMemories.length > 0 ? (
                    displayedMemories.map(memory => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            className="w-full transform transition-transform duration-300 md:hover:-translate-y-0.5"
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl">
                        <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-xl font-semibold text-gray-700">Tidak ada kenangan ditemukan</p>
                        <p className="text-gray-500 mt-2">Coba sesuaikan pencarian atau filter Anda</p>
                    </div>
                )}
            </div>

            {/* Load More Button */}
            {displayedMemories.length < filteredMemories.length && (
                <div className="flex justify-center mt-12">
                    <button onClick={handleLoadMore}
                        className="group relative px-8 py-4 font-semibold text-blue-600 bg-white 
                        border-2 border-blue-600 rounded-xl transition-all duration-300
                        hover:bg-blue-600 hover:text-white hover:shadow-lg
                        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 flex items-center gap-3"
                    >
                        <span className="relative z-10">Muat Lebih Banyak Kenangan</span>
                        <ChevronDown className="w-5 h-5 transition-transform duration-300 
                                            group-hover:translate-y-1 relative z-10" />
                        <div className="absolute inset-0 h-full w-0 bg-blue-600 
                                    transition-all duration-300 ease-out group-hover:w-full rounded-xl" />
                    </button>
                </div>
            )}
        </div>
    );
};
export default MemoryGalleryAll;