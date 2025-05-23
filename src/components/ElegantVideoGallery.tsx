import { useState, useEffect, useMemo } from 'react';
import { X, Play, Maximize2, Minimize2, Film, Calendar, Search, ChevronDown, Heart, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoWithMemoryInfo, MediaItem } from '../types/Memory';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import React from 'react';
import { useFetchMemories } from '../hooks/useFetchMemories';

const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
const THUMBNAILS_CACHE_KEY = 'video_thumbnails_cache';

// Fungsi untuk mendapatkan thumbnails dari cache
const getThumbnailsFromCache = (): Record<string, string> => {
    try {
        const cached = localStorage.getItem(THUMBNAILS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
        return {};
    } catch (error) {
        console.error('Error reading thumbnails cache:', error);
        return {};
    }
};

// Fungsi untuk menyimpan thumbnails ke cache
const saveThumbnailsToCache = (data: Record<string, string>) => {
    try {
        localStorage.setItem(THUMBNAILS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving thumbnails to cache:', error);
    }
};

// Fungsi untuk menghasilkan thumbnail menggunakan Cloudinary
const generateThumbnail = async (videoUrl: string): Promise<string> => {
    try {
        // Format URL Cloudinary untuk menghasilkan thumbnail
        const cloudinaryUrl = `${CLOUDINARY_BASE_URL}w_300,h_200,c_fill/${videoUrl}`;
        return cloudinaryUrl;
    } catch (error) {
        console.error('Error generating thumbnail with Cloudinary:', error);
        throw error;
    }
};

const ModernVideoGallery = () => {
    const navigate = useNavigate();
    const [selectedVideo, setSelectedVideo] = useState<VideoWithMemoryInfo | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [selectedDate, setSelectedDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Fetching data using the useFetchMemories hook
    const { data: memories, isLoading, error } = useFetchMemories();
    
    // Extract videos from memories
    const videos = useMemo(() => {
        if (!memories) return [];
        
        return memories.flatMap((memory) =>
            memory.media
                .filter((item): item is (MediaItem & { type: 'video' }) => item.type === 'video')
                .map((video: any) => ({
                    ...video,
                    memoryTitle: memory.title,
                    memoryDate: memory.date
                }))
        );
    }, [memories]);

    // Generate thumbnails for videos
    useEffect(() => {
        const generateThumbnails = async () => {
            if (!videos || videos.length === 0) return;
            
            // Get cached thumbnails
            const cachedThumbnails = getThumbnailsFromCache();
            const newThumbnails = { ...cachedThumbnails };
            
            // Generate missing thumbnails
            for (const video of videos) {
                if (!newThumbnails[video.url]) {
                    try {
                        const thumbnailUrl = await generateThumbnail(video.url);
                        newThumbnails[video.url] = thumbnailUrl;
                    } catch (error) {
                        console.error('Failed to generate thumbnail:', error);
                    }
                }
            }
            
            setThumbnails(newThumbnails);
            saveThumbnailsToCache(newThumbnails);
        };
        
        generateThumbnails();
    }, [videos]);

    // Handle window resize for responsive pagination
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            
            // Update items per page based on screen size
            if (window.innerWidth < 768) { // mobile
                setItemsPerPage(4); // 2 columns x 2 rows
            } else {
                setItemsPerPage(8); // 4 columns x 2 rows for tablet and above
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial values
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Handle modal open/close
    useEffect(() => {
        if (selectedVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedVideo]);

    const handleVideoClick = (video: VideoWithMemoryInfo) => {
        setSelectedVideo(video);
    };

    const handleCloseModal = () => {
        setSelectedVideo(null);
        setIsFullScreen(false);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    // Filter and sort videos
    const filteredVideos = useMemo(() => {
        let filtered = [...videos];

        // Filter berdasarkan search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(video =>
                video.memoryTitle.toLowerCase().includes(query) ||
                video.description?.toLowerCase().includes(query)
            );
        }

        // Filter berdasarkan tanggal
        if (selectedDate) {
            filtered = filtered.filter(video => video.memoryDate.startsWith(selectedDate));
        }

        // Sort berdasarkan tanggal
        return filtered.sort((a, b) => {
            const dateA = new Date(a.memoryDate);
            const dateB = new Date(b.memoryDate);
            return sortBy === 'newest' ?
                dateB.getTime() - dateA.getTime() :
                dateA.getTime() - dateB.getTime();
        });
    }, [videos, searchQuery, selectedDate, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Smooth scroll to top of gallery
        document.getElementById('gallery-top')?.scrollIntoView({ behavior: 'smooth' });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat video...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Terjadi kesalahan</h2>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tidak ada video ditemukan</h2>
                    <p className="text-gray-600 mb-6">Coba sesuaikan filter atau periksa koneksi Anda</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 md:rounded-3xl rounded-xl md:mt-8">
            <div id="gallery-top" className="relative max-w-7xl mx-auto md:px-6 px-3 md:py-8">
                {/* Header Section */}
                <div className="text-center md:mb-12 mb-8">
                    <div className="inline-flex items-center justify-center p-2 bg-white/30 backdrop-blur-sm rounded-2xl mb-4">
                        <Film className="w-5 h-5 text-violet-500 mr-2" />
                        <span className="text-sm font-medium text-violet-700">Galeri Video</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Kenangan Indah Kita
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Kumpulan momen-momen berharga yang terabadikan dalam video
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/40 md:rounded-2xl p-4 mb-8 md:shadow-lg shadow-md rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari kenangan..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={toggleFilter}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {isFilterOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
                                    <input
                                        type="month"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setCurrentPage(1); // Reset to first page on filter change
                                        }}
                                        className="w-full px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value as 'newest' | 'oldest');
                                            setCurrentPage(1); // Reset to first page on sort change
                                        }}
                                        className="w-full px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    >
                                        <option value="newest">Terbaru</option>
                                        <option value="oldest">Terlama</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Counter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-gray-600 text-sm">
                        Menampilkan <span className="font-semibold">{currentItems.length}</span> dari <span className="font-semibold">{filteredVideos.length}</span> video
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="text-sm text-gray-600">
                            Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
                        </div>
                    )}
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 gap-4">
                    {currentItems.map((video, index) => (
                        <div
                            key={index}
                            className="group relative transform transition-all duration-500 hover:z-10 hover:scale-105"
                            style={{
                                transform: `rotate(${Math.random() * 4 - 2}deg)`,
                            }}
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group-hover:rotate-0">
                                {/* Thumbnail Container with Polaroid Effect */}
                                <div className="aspect-video relative overflow-hidden border-b-8 border-white">
                                    {thumbnails[video.url] ? (
                                        <img
                                            src={thumbnails[video.url]}
                                            alt={video.memoryTitle}
                                            className="w-full h-full object-cover transform transition-all duration-700 md:group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                        {Math.floor(Math.random() * 3) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="md:px-4 md:py-4 px-2.5 py-1.5">
                                    <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-violet-600 transition-colors">
                                        {video.memoryTitle}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(video.memoryDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4 text-pink-500" />
                                            <span className='md:block hidden'>Kenangan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tape/Sticker Effect */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-yellow-200 rotate-6 opacity-80"></div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <div className="inline-flex rounded-lg bg-white/50 backdrop-blur-sm p-1 shadow-md">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                                    currentPage === 1 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-violet-600 hover:bg-violet-100'
                                } transition-colors`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="hidden sm:flex">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show first page, last page, current page, and pages around current
                                        return page === 1 || 
                                            page === totalPages || 
                                            (page >= currentPage - 1 && page <= currentPage + 1);
                                    })
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => paginate(page)}
                                                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                                                    currentPage === page
                                                    ? 'bg-violet-600 text-white'
                                                    : 'text-gray-700 hover:bg-violet-100'
                                                } transition-all`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                            
                            {/* Mobile pagination display */}
                            <div className="flex sm:hidden items-center justify-center w-20 h-10 text-gray-700">
                                <span>{currentPage} / {totalPages}</span>
                            </div>
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                                    currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-violet-600 hover:bg-violet-100'
                                } transition-colors`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 z-997 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={handleCloseModal}
                    >
                        <div
                            className={`relative bg-black rounded-2xl overflow-hidden transition-all duration-500 ${isFullScreen ? 'w-full h-full' : 'w-full max-w-4xl'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Controls */}
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button
                                    onClick={toggleFullScreen}
                                    className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors"
                                >
                                    {isFullScreen ? (
                                        <Minimize2 className="w-5 h-5 text-white" />
                                    ) : (
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Video Player */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                <video
                                    controls
                                    autoPlay
                                    poster={thumbnails[selectedVideo.url]}
                                    className="max-w-full max-h-full"
                                    style={{
                                        width: isFullScreen ? '100%' : 'auto',
                                        height: isFullScreen ? '100%' : 'auto',
                                        maxHeight: isFullScreen ? '100vh' : '80vh'
                                    }}
                                >
                                    <source src={selectedVideo.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Video Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <h2 className="text-xl font-medium text-white mb-2">
                                    {selectedVideo.memoryTitle}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(selectedVideo.memoryDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-pink-500" />
                                        <span>Kenangan Indah</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernVideoGallery;