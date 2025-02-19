import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Video, Calendar, ChevronLeft, ChevronRight, Play, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory, MediaItem } from '../types/Memory';
import { useIsMobile } from '../hooks/isMobile';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.currentTime = 1; // Set to 1 second

        video.addEventListener('loadeddata', () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Could not get canvas context');
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnailUrl = canvas.toDataURL('image/webp');
                video.remove();
                resolve(thumbnailUrl);
            } catch (error) {
                reject(error);
            }
        });

        video.addEventListener('error', (error) => {
            reject(error);
        });

        video.load();
    });
};

interface MediaDisplayProps {
    media: MediaItem;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ media }) => {
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

    useEffect(() => {
        if (media.type === 'video') {
            generateVideoThumbnail(media.url)
                .then((thumbnail: string) => setVideoThumbnail(thumbnail))
                .catch(err => console.error('Error generating thumbnail:', err));
        }
    }, [media.url, media.type]);

    if (media.type === 'video') {
        return (
            <motion.div
                className="relative w-full h-[80vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <video
                    controls
                    poster={videoThumbnail || media.thumbnail}
                    className="absolute inset-0 w-full h-full object-contain bg-black/95 rounded-lg"
                >
                    <source src={media.url} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>
            </motion.div>
        );
    }
    return (
        <motion.div
            className="relative w-full h-[80vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <img
                src={media.url}
                alt="media"
                className="absolute inset-0 w-full h-full object-contain bg-black/95 rounded-lg"
            />
        </motion.div>
    );
};

const MemoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
    const isMobile = useIsMobile();

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

    // Fetch memory with comprehensive error handling
    const {
        data: memory,
        isLoading: loading,
        error,
    } = useQuery<Memory, Error>(
        ['memory', id],
        async () => {
            const token = sessionStorage.getItem('authToken');

            if (!id) throw new Error('No memory ID provided');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await fetch(`${API_URL}/api/memories/${id}`, {
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
                const cachedData = queryClient.getQueryData<Memory>(['memory', id]);

                if (!cachedData) return newData;

                const isDataChanged = JSON.stringify(cachedData) !== JSON.stringify(newData);

                return isDataChanged ? newData : cachedData;
            }
        }
    );

    useEffect(() => {
        if (memory) {
            // Generate thumbnails for all videos
            const videoPromises = memory.media
                .filter((item): item is MediaItem & { type: 'video' } => item.type === 'video')
                .map(async video => {
                    try {
                        const thumbnail = await generateVideoThumbnail(video.url);
                        setThumbnails(prev => ({
                            ...prev,
                            [video.url]: thumbnail
                        }));
                    } catch (error) {
                        console.error('Error generating thumbnail:', error);
                    }
                });

            Promise.all(videoPromises);
        }
    }, [memory]);

    if (loading) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <motion.div
                        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <motion.p
                        className="text-gray-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Memuat kenangan...
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    if (error || !memory) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    </motion.div>
                    <motion.h2
                        className="text-2xl font-semibold text-gray-700 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Kenangan tidak ditemukan
                    </motion.h2>
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full transition-all transform"
                        whileHover={!isMobile ? { scale: 1.05, backgroundColor: "#2563EB" } : undefined}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    const filteredMedia = memory.media.filter(item =>
        filter === 'all' ? true : item.type === filter
    );

    const photoCount = memory.media.filter(item => item.type === 'photo').length;
    const videoCount = memory.media.filter(item => item.type === 'video').length;

    const navigateMedia = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setSelectedMediaIndex(prev => (prev > 0 ? prev - 1 : memory.media.length - 1));
        } else {
            setSelectedMediaIndex(prev => (prev < memory.media.length - 1 ? prev + 1 : 0));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <motion.button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 text-gray-700 rounded-full transition-all cursor-pointer"
                        whileHover={!isMobile ? { backgroundColor: "rgba(243, 244, 246, 1)" } : undefined}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </motion.button>
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(memory.date)}
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            <div className="pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-6 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {memory.title}
                        </motion.h1>
                        <motion.p
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {memory.description}
                        </motion.p>
                    </motion.div>

                    {memory.media && memory.media.length > 0 && (
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="relative group">
                                <motion.div
                                    className="bg-black rounded-2xl overflow-hidden cursor-pointer shadow-xl"
                                    layoutId={`media-${selectedMediaIndex}`}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <AnimatePresence mode="wait">
                                        <MediaDisplay
                                            key={selectedMediaIndex}
                                            media={memory.media[selectedMediaIndex]}
                                        />
                                    </AnimatePresence>
                                </motion.div>

                                {!isMobile && (
                                    <>
                                        <motion.button
                                            onClick={() => navigateMedia('prev')}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => navigateMedia('next')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)", scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </motion.button>
                                    </>
                                )}

                                {isMobile && (
                                    <>
                                        <motion.button
                                            onClick={() => navigateMedia('prev')}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800"
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => navigateMedia('next')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800"
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    </>
                                )}
                            </div>

                            <motion.div
                                className="flex justify-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key={`all-${filter === 'all'}`}
                                        onClick={() => setFilter('all')}
                                        className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'all'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white text-gray-700'
                                            }`}
                                        whileHover={!isMobile ? { scale: filter === 'all' ? 1 : 1.05 } : undefined}
                                        whileTap={{ scale: 0.95 }}
                                        layout
                                    >
                                        <motion.span
                                            className="md:text-xl text-xs"
                                            layout
                                        >
                                            All ({memory.media.length})
                                        </motion.span>
                                    </motion.button>
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key={`photo-${filter === 'photo'}`}
                                        onClick={() => setFilter('photo')}
                                        className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'photo'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white text-gray-700'
                                            }`}
                                        whileHover={!isMobile ? { scale: filter === 'photo' ? 1 : 1.05 } : undefined}
                                        whileTap={{ scale: 0.95 }}
                                        layout
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        <motion.span
                                            className="md:text-xl text-xs"
                                            layout
                                        >
                                            Photos ({photoCount})
                                        </motion.span>
                                    </motion.button>
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    <motion.button
                                        key={`video-${filter === 'video'}`}
                                        onClick={() => setFilter('video')}
                                        className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'video'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white text-gray-700'
                                            }`}
                                        whileHover={!isMobile ? { scale: filter === 'video' ? 1 : 1.05 } : undefined}
                                        whileTap={{ scale: 0.95 }}
                                        layout
                                    >
                                        <Video className="w-4 h-4" />
                                        <motion.span
                                            className="md:text-xl text-xs"
                                            layout
                                        >
                                            Videos ({videoCount})
                                        </motion.span>
                                    </motion.button>
                                </AnimatePresence>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, staggerChildren: 0.05 }}
                            >
                                {filteredMedia.map((item, index) => {
                                    const originalIndex = memory.media.indexOf(item);
                                    return (
                                        <motion.button
                                            key={index}
                                            onClick={() => setSelectedMediaIndex(originalIndex)}
                                            className={`relative aspect-square rounded-xl overflow-hidden group transition-all ${originalIndex === selectedMediaIndex
                                                    ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-50'
                                                    : ''
                                                }`}
                                            layoutId={`thumbnail-${originalIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={!isMobile ? { scale: 1.05, y: -5 } : undefined}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <img
                                                src={item.type === 'video' ? thumbnails[item.url] || item.thumbnail || item.url : item.url}
                                                alt="media-thumbnail"
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                            {item.type === 'video' && (
                                                <motion.div
                                                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors cursor-pointer"
                                                    whileHover={!isMobile ? { backgroundColor: "rgba(0, 0, 0, 0.4)" } : undefined}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"
                                                        whileHover={!isMobile ? { scale: 1.1 } : undefined}
                                                        whileTap={{ scale: 0.9 }}
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    >
                                                        <Play className="w-6 h-6 text-blue-600" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        </motion.div>
                    )}

                    {memory.tags && memory.tags.length > 0 && (
                        <motion.div
                            className="mt-8 flex flex-wrap gap-2 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {memory.tags.map((tag, index) => (
                                <motion.span
                                    key={index}
                                    className="text-sm font-medium text-gray-600 border border-gray-300 rounded-full px-4 py-1"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                    whileHover={!isMobile ? {
                                        scale: 1.05,
                                        backgroundColor: "rgba(243, 244, 246, 1)",
                                        borderColor: "rgba(209, 213, 219, 1)"
                                    } : undefined}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MemoryDetail;