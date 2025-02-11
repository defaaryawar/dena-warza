import { useState, useEffect, useRef } from 'react';
import { X, Play, Maximize2, Minimize2, Film, Calendar, Search, ChevronDown, Heart } from 'lucide-react';
import { VideoWithMemoryInfo, MediaItem } from '../types/Memory';
import { useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const VIDEOS_CACHE_KEY = 'video_gallery_cache';
const THUMBNAILS_CACHE_KEY = 'video_thumbnails_cache';

// Fungsi untuk mendapatkan video dari cache
const getVideosFromCache = (): VideoWithMemoryInfo[] | null => {
    try {
        const cached = localStorage.getItem(VIDEOS_CACHE_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
        return null;
    } catch (error) {
        console.error('Error reading videos cache:', error);
        return null;
    }
};

// Fungsi untuk menyimpan video ke cache
const saveVideosToCache = (data: VideoWithMemoryInfo[]) => {
    try {
        localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving videos to cache:', error);
    }
};

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

const ModernVideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState<VideoWithMemoryInfo | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [videos, setVideos] = useState<VideoWithMemoryInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [selectedDate, setSelectedDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const videoRefs = useRef<Record<string, HTMLVideoElement>>({});

    const generateThumbnail = (video: HTMLVideoElement, videoUrl: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg');
        setThumbnails(prev => {
            const newThumbnails = { ...prev, [videoUrl]: thumbnail };
            saveThumbnailsToCache(newThumbnails);
            return newThumbnails;
        });
    };

    const handleVideoLoad = (video: HTMLVideoElement, videoUrl: string) => {
        video.currentTime = 1;
        video.addEventListener('seeked', () => {
            generateThumbnail(video, videoUrl);
        }, { once: true });
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Cek cache untuk video
                const cachedVideos = getVideosFromCache();
                const cachedThumbnails = getThumbnailsFromCache();

                if (cachedVideos) {
                    console.log('Using cached videos');
                    setVideos(cachedVideos);
                    setThumbnails(cachedThumbnails);
                    setLoading(false);
                    return;
                }

                console.log('Fetching videos from API');
                const response = await fetch(`${API_URL}/api/memories`);
                if (!response.ok) throw new Error('Failed to fetch memories');
                const memories = await response.json();

                const allVideos = memories.flatMap((memory: { media: any[]; title: any; date: any; }) =>
                    memory.media
                        .filter((item): item is (MediaItem & { type: 'video' }) => item.type === 'video')
                        .map((video: any) => ({
                            ...video,
                            memoryTitle: memory.title,
                            memoryDate: memory.date
                        }))
                );

                saveVideosToCache(allVideos);
                setVideos(allVideos);
            } catch (error) {
                console.error('Error fetching videos:', error);

                // Jika error, coba gunakan cache
                const cachedVideos = getVideosFromCache();
                if (cachedVideos) {
                    setVideos(cachedVideos);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        videos.forEach(video => {
            if (!videoRefs.current[video.url] && !thumbnails[video.url]) {
                const videoElement = document.createElement('video');
                videoElement.crossOrigin = 'anonymous';
                videoElement.src = video.url;
                videoElement.load();
                videoRefs.current[video.url] = videoElement;
                videoElement.addEventListener('loadedmetadata', () => {
                    handleVideoLoad(videoElement, video.url);
                });
            }
        });

        return () => {
            Object.values(videoRefs.current).forEach(video => {
                video.remove();
            });
            videoRefs.current = {};
        };
    }, [videos]);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
                <div className="text-gray-600">Loading videos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50">  

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
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
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 mb-8 shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari kenangan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
                                    <input
                                        type="month"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
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

                {/* Video Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 gap-3">
                    {filteredVideos.map((video, index) => (
                        <div
                            key={index}
                            className="group relative transform transition-all duration-500 hover:z-10"
                            style={{
                                transform: `rotate(${Math.random() * 6 - 3}deg)`,
                                marginTop: `${(index % 3) * 10}px`
                            }}
                            onClick={() => handleVideoClick(video)}
                        >
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group-hover:rotate-0">
                                {/* Thumbnail Container */}
                                <div className="aspect-video relative overflow-hidden">
                                    {thumbnails[video.url] ? (
                                        <img
                                            src={thumbnails[video.url]}
                                            alt={video.memoryTitle}
                                            className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Video Info */}
                                <div className="p-4">
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
                        </div>
                    ))}
                </div>

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