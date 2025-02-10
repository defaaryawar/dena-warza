import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Video, Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { Memory, MediaItem } from '../types/Memory';

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
                const thumbnailUrl = canvas.toDataURL('image/jpeg');
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
            <div className="relative w-full h-[80vh]">
                <video
                    controls
                    poster={videoThumbnail || media.thumbnail}
                    className="absolute inset-0 w-full h-full object-contain bg-black/95"
                >
                    <source src={media.url} type="video/mp4" />
                    <p>Your browser does not support the video tag.</p>
                </video>
            </div>
        );
    }
    return (
        <div className="relative w-full h-[80vh]">
            <img
                src={media.url}
                alt="media"
                className="absolute inset-0 w-full h-full object-contain bg-black/95"
            />
        </div>
    );
};

const MemoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

    // Menggunakan useQuery untuk fetch dan cache data
    const {
        data: memory,
        isLoading: loading,
        error,
    } = useQuery<Memory, Error>(
        ['memory', id], // Key untuk query
        async () => {
            if (!id) throw new Error('No memory ID provided');
            const response = await fetch(`${API_URL}/api/memories/${id}`);
            if (!response.ok) throw new Error('Memory not found');
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
                const cachedData = queryClient.getQueryData<Memory>(['memory', id]);

                // Jika tidak ada data cache, kembalikan data baru
                if (!cachedData) return newData;

                // Bandingkan data cache dengan data baru
                const isDataChanged = JSON.stringify(cachedData) !== JSON.stringify(newData);

                // Jika data tidak berubah, kembalikan data cache
                if (!isDataChanged) return cachedData;

                // Jika data berubah, kembalikan data baru
                return newData;
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading memory...</p>
                </div>
            </div>
        );
    }

    if (error || !memory) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center px-4">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Memory not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full md:hover:bg-blue-700 transition-all transform md:hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                </div>
            </div>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 text-gray-700 md:hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(memory.date)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-6 pt-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            {memory.title}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {memory.description}
                        </p>
                    </div>

                    {memory.media && memory.media.length > 0 && (
                        <div className="space-y-6">
                            <div className="relative group">
                                <div className="bg-black rounded-2xl overflow-hidden cursor-pointer">
                                    <MediaDisplay media={memory.media[selectedMediaIndex]} />
                                </div>

                                <button
                                    onClick={() => navigateMedia('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 md:group-hover:opacity-100 transition-opacity md:hover:bg-white cursor-pointer"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => navigateMedia('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 md:group-hover:opacity-100 transition-opacity md:hover:bg-white cursor-pointer"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'all'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white text-gray-700 md:hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="md:text-xl text-xs">All ({memory.media.length})</span>
                                </button>
                                <button
                                    onClick={() => setFilter('photo')}
                                    className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'photo'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white text-gray-700 md:hover:bg-gray-50'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="md:text-xl text-xs">Photos ({photoCount})</span>
                                </button>
                                <button
                                    onClick={() => setFilter('video')}
                                    className={`md:px-6 md:py-2.5 px-4 py-2.5 gap-1 rounded-full flex items-center md:gap-2 transition-all cursor-pointer ${filter === 'video'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white text-gray-700 md:hover:bg-gray-50'
                                        }`}
                                >
                                    <Video className="w-4 h-4" />
                                    <span className="md:text-xl text-xs">Videos ({videoCount})</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {filteredMedia.map((item, index) => {
                                    const originalIndex = memory.media.indexOf(item);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedMediaIndex(originalIndex)}
                                            className={`relative aspect-square rounded-xl overflow-hidden group transition-all md:hover:scale-105 ${originalIndex === selectedMediaIndex
                                                    ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-50'
                                                    : ''
                                                }`}
                                        >
                                            <img
                                                src={item.type === 'video' ? thumbnails[item.url] || item.thumbnail || item.url : item.url}
                                                alt="media-thumbnail"
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                            {item.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 md:group-hover:bg-black/40 transition-colors cursor-pointer">
                                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                                        <Play className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {memory.tags && memory.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2 justify-center">
                            {memory.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm font-medium text-gray-600 border border-gray-300 rounded-full px-4 py-1"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemoryDetail;