import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memories } from '../data/dataImage';
import { ArrowLeft, Image as ImageIcon, Video, Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const MediaDisplay = ({ media }: { media: { type: string; url: string; thumbnail?: string } }) => {
    if (media.type === 'video') {
        // Pisahkan base URL Cloudinary dari transformasi
        const baseUrl = media.url.replace(`${import.meta.env.VITE_CLOUDINARY_BASE_URL}`, '');
        const [version, filename] = baseUrl.split('/');

        // Konstruksi ulang URL dengan transformasi
        const cloudinaryUrl = `${import.meta.env.VITE_CLOUDINARY_URL}/${version}/${filename}`;

        const thumbnailUrl = media.thumbnail;

        return (
            <div className="relative w-full h-[80vh]">
                <video
                    controls
                    poster={thumbnailUrl}
                    className="absolute inset-0 w-full h-full object-contain bg-black/95"
                >
                    <source src={cloudinaryUrl} type="video/mp4" />
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
    const memory = memories.find(mem => mem.id === id);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

    if (!memory) {
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
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Bar */}
            <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {memory.date}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4">
                    {/* Title Section */}
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
                            {/* Main Media Display with Navigation */}
                            <div className="relative group">
                                <div className="bg-black rounded-2xl overflow-hidden cursor-pointer">
                                    <MediaDisplay key={memory.media[selectedMediaIndex].url} media={memory.media[selectedMediaIndex]} />
                                </div>

                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => navigateMedia('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => navigateMedia('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${filter === 'all'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>All ({memory.media.length})</span>
                                </button>
                                <button
                                    onClick={() => setFilter('photo')}
                                    className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${filter === 'photo'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Photos ({photoCount})</span>
                                </button>
                                <button
                                    onClick={() => setFilter('video')}
                                    className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${filter === 'video'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Video className="w-4 h-4" />
                                    <span>Videos ({videoCount})</span>
                                </button>
                            </div>

                            {/* Media Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {filteredMedia.map((item, index) => {
                                    const originalIndex = memory.media.indexOf(item);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedMediaIndex(originalIndex)}
                                            className={`relative aspect-square rounded-xl overflow-hidden group transition-all hover:scale-105 ${originalIndex === selectedMediaIndex
                                                ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-gray-50'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                src={item.type === 'video' ? item.thumbnail || item.url : item.url}
                                                alt="media-thumbnail"
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                            {item.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer">
                                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                                        <Play className="w-6 h-6 text-blue-600" /> {/* Ikon Play */}
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
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
