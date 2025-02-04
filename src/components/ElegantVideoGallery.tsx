import { useState, useEffect } from 'react';
import { memories } from '../data/dataImage';
import { X, Play, Maximize2, Minimize2, Film } from 'lucide-react';
import { VideoWithMemoryInfo, MediaItem } from '../types/Memory';

const getAllVideos = (): VideoWithMemoryInfo[] => {
    return memories.flatMap(memory =>
        memory.media
            .filter((item): item is (MediaItem & { type: 'video' }) => item.type === 'video')
            .map(video => ({
                ...video,
                memoryTitle: memory.title,
                memoryDate: memory.date
            }))
    );
};

const ModernVideoGallery = () => {
    const [selectedVideo, setSelectedVideo] = useState<VideoWithMemoryInfo | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [videos, setVideos] = useState<VideoWithMemoryInfo[]>([]);

    useEffect(() => {
        setVideos(getAllVideos());
    }, []);

    // Effect untuk mengatur scroll saat modal terbuka
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50">
            <div className="max-w-full mx-auto px-2 py-8">
                {/* Abstract Header */}
                <div className="relative mb-8 text-center px-4">
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-24 h-24 rounded-full blur-2xl"
                                style={{
                                    background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                                    left: `${20 * i}%`,
                                    transform: `rotate(${45 * i}deg)`
                                }}
                            />
                        ))}
                    </div>
                    <h1 className="relative text-3xl font-bold text-gray-800 mb-2">
                        Momen yang ditangkap
                    </h1>
                    <div className="relative flex items-center justify-center gap-2 text-gray-600">
                        <Film className="w-4 h-4" />
                        <p className="text-sm">Koleksi Video Kami</p>
                    </div>
                </div>

                {/* Abstract Video Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
                    {videos.map((video, index) => (
                        <div
                            key={index}
                            className="group relative transform transition-all duration-300 md:hover:scale-105 hover:z-10"
                            style={{
                                marginTop: `${(index % 5) * 8}px`,
                                transform: `rotate(${(index % 2) * 2 - 1}deg)`
                            }}
                        >
                            {/* Card with Abstract Design */}
                            <div
                                className="relative bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg md:hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                onClick={() => handleVideoClick(video)}
                            >
                                {/* Abstract Decoration */}
                                <div className="absolute -right-4 -top-4 w-12 h-12 bg-teal-200/30 rounded-full blur-md transform rotate-45" />

                                {/* Thumbnail with Dynamic Overlay */}
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.memoryTitle}
                                        className="w-full h-full object-cover transform transition-transform md:group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all md:group-hover:scale-110">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                <Play className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Minimal Info */}
                                <div className="p-3 bg-white/50 backdrop-blur-sm">
                                    <h3 className="font-medium text-sm text-gray-800 truncate">
                                        {video.memoryTitle}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                        {new Date(video.memoryDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal with Abstract Design */}
                {selectedVideo && (
                    <div className="fixed inset-0 z-992 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
                        <div
                            className={`relative bg-black/80 rounded-lg overflow-hidden ${isFullScreen ? 'w-full h-full' : 'w-full max-w-3xl aspect-video'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Abstract Control Buttons */}
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button
                                    onClick={toggleFullScreen}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-full md:hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    {isFullScreen ? (
                                        <Minimize2 className="w-5 h-5 text-white" />
                                    ) : (
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-full md:hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Video Player with Contained Aspect Ratio */}
                            <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <video
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full object-contain"
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                        maxHeight: isFullScreen ? '100vh' : '80vh'
                                    }}
                                >
                                    <source src={selectedVideo.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Minimal Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                <h2 className="text-lg font-medium text-white">
                                    {selectedVideo.memoryTitle}
                                </h2>
                                <p className="text-xs text-gray-300 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                    {new Date(selectedVideo.memoryDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernVideoGallery;