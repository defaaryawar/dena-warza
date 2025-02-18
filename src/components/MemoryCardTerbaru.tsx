import React, { useMemo, useState } from 'react';
import { Image as ImageIcon, Video, Calendar, Tag, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Memory } from '../types/Memory';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/isMobile'; // Import hook useIsMobile

interface MemoryCardProps {
    memory: Memory;
    className?: string;
    isLoading?: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, className, isLoading }) => {
    const [imageError, setImageError] = useState(false);
    const isMobile = useIsMobile(); // Gunakan hook useIsMobile

    if (!memory && !isLoading) {
        return null;
    }

    const firstMedia = memory?.media?.[0];

    const formattedDate = useMemo(() => {
        const formatDate = (dateString: string) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                const monthNames = [
                    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
                ];
                return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            } catch (error) {
                console.error('Invalid date format:', dateString);
                return '';
            }
        };
        return formatDate(memory?.date);
    }, [memory?.date]);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <>
            {memory.id && (
                <Link to={`/memory/${memory.id}`}>
                    <motion.div
                        className={`relative bg-white rounded-lg shadow-sm transition-all duration-300
                overflow-hidden flex flex-col ${className}`}
                        whileHover={!isMobile ? {
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            y: -5,
                        } : {}}
                        transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                    >
                        {isLoading ? (
                            <div className="animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 
                    h-full w-full absolute inset-0">
                                <div className="h-32 bg-gray-300"></div>
                                <div className="p-3">
                                    <div className="h-5 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Media Section */}
                                <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                                    {firstMedia && !imageError ? (
                                        <>
                                            <img
                                                src={firstMedia.url}
                                                alt={memory.title || 'Memory image'}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={handleImageError}
                                            />

                                            {/* Media Type Indicator */}
                                            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm 
                                    rounded-full p-1.5">
                                                {firstMedia.type === 'photo' ? (
                                                    <ImageIcon className="text-blue-500 w-3.5 h-3.5" />
                                                ) : (
                                                    <Video className="text-blue-500 w-3.5 h-3.5" />
                                                )}
                                            </div>

                                            {/* Multiple Media Indicator */}
                                            {memory.media && memory.media.length > 0 && (
                                                <div className="absolute top-2 left-2 bg-white/60 backdrop-blur-sm 
                                        rounded-md px-3 py-0.5">
                                                    <span className="text-xs font-medium text-blue-500">
                                                        {memory.media.length} foto/video
                                                    </span>
                                                </div>
                                            )}

                                            {/* Video Play Button */}
                                            {firstMedia.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm 
                                            flex items-center justify-center">
                                                        <Video className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center 
                                text-gray-400">
                                            <ImageOff className="w-6 h-6 mb-1" />
                                            <span className="text-xs">Tidak ada media</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-3 flex flex-col flex-1">
                                    <div className="flex-1">
                                        {/* Title */}
                                        <h2 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 leading-snug">
                                            {memory.title || 'Memori Tanpa Judul'}
                                        </h2>

                                        {/* Description */}
                                        {memory.description && (
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-normal">
                                                {memory.description}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {memory.tags && memory.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {memory.tags.slice(0, isMobile ? 2 : 4).map((tag, index) => (
                                                    <motion.span
                                                        key={`${tag}-${index}`}
                                                        className="inline-flex items-center px-1.5 py-0.5 
                                            bg-blue-50 text-blue-600 rounded-full text-[9px] 
                                            font-medium gap-0.5"
                                                    >
                                                        <Tag className="w-2 h-2" />
                                                        {tag}
                                                    </motion.span>
                                                ))}
                                                {memory.tags.length > (isMobile ? 2 : 4) && (
                                                    <span className="text-[9px] text-gray-500 px-1">
                                                        +{memory.tags.length - (isMobile ? 2 : 4)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center 
                            justify-between mt-2">
                                        <div className="flex items-center text-[10px] text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>{formattedDate || 'Tanggal tidak tersedia'}</span>
                                        </div>
                                        {memory.id && (
                                            <Link
                                                to={`/memory/${memory.id}`}
                                                className="text-[10px] text-blue-600 font-medium 
                                    hover:text-blue-800 transition-colors duration-200"
                                            >
                                                Lihat Detail
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </Link>
            )
            }
        </>
    );
};

export default React.memo(MemoryCard);