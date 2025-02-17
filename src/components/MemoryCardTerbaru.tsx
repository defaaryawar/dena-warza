import React, { useMemo, useState } from 'react';
import { Image as ImageIcon, Video, Calendar, Tag, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Memory } from '../types/Memory';

interface MemoryCardProps {
    memory: Memory;
    className?: string;
    isLoading?: boolean; // Add a prop to handle loading state
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, className, isLoading }) => {
    const [imageError, setImageError] = useState(false);

    // Handle null/undefined memory
    if (!memory && !isLoading) {
        return null;
    }

    const firstMedia = memory?.media?.[0];

    // Format date using useMemo to avoid recalculating on every render
    const formattedDate = useMemo(() => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                const monthNames = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];
                return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            } catch (error) {
                console.error('Invalid date format:', dateString);
                return '';
            }
        };
        return formatDate(memory?.date);
    }, [memory?.date]);

    // Handle image load error
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className={`relative bg-white rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 group overflow-hidden md:hover:shadow-lg flex flex-col ${className}`}>
            {/* Loading state - shimmer effect */}
            {isLoading ? (
                <div className="animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 h-full w-full absolute inset-0">
                    <div className="h-40 bg-gray-300 mb-2"></div>
                    <div className="w-full h-8 bg-gray-300"></div>
                    <div className="w-3/4 h-6 bg-gray-300 mt-2"></div>
                </div>
            ) : (
                <>
                    {/* Media Section - Falls back to placeholder if no media */}
                    <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden bg-gray-100">
                        {firstMedia && !imageError ? (
                            <>
                                <img
                                    src={firstMedia.url}
                                    alt={memory.title || 'Memory image'}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={handleImageError}
                                />

                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                                    {firstMedia.type === 'photo' ? (
                                        <ImageIcon className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Video className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </div>

                                {memory.media && memory.media.length > 1 && (
                                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
                                        <span className="text-xs sm:text-sm font-medium text-blue-500">
                                            {memory.media.length} media
                                        </span>
                                    </div>
                                )}

                                {firstMedia.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <ImageOff className="w-8 h-8 mb-2" />
                                <span className="text-sm">Tidak ada media</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="relative p-3 sm:p-4 flex flex-col flex-1">
                        <div className="flex-1">
                            {/* Title - Falls back to placeholder if none */}
                            <h2 className="text-md sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2">
                                {memory.title || 'Memori Tanpa Judul'}
                            </h2>

                            {/* Description - Only shown if exists */}
                            {memory.description && (
                                <p className="text-xs sm:text-base text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                                    {memory.description}
                                </p>
                            )}

                            {/* Tags - Only shown if exist */}
                            {memory.tags && memory.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    {memory.tags.map((tag, index) => (
                                        <span
                                            key={`${tag}-${index}`}
                                            className="inline-flex items-center px-2 py-0.5 sm:py-1 
                                            bg-blue-100 text-blue-600 rounded-full text-[9px] sm:text-xs font-medium gap-1"
                                        >
                                            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Section */}
                        <div className="pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                <span>{formattedDate || 'Tanggal tidak tersedia'}</span>
                            </div>
                            {memory.id && (
                                <Link
                                    to={`/memory/${memory.id}`}
                                    className="text-xs sm:text-sm text-blue-600 
                                    md:hover:text-blue-600 md:hover:underline font-medium transition-colors"
                                >
                                    Lihat Detail
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(MemoryCard);
