import React from 'react';
import { Image, Video, MapPin, Calendar, Tag } from 'lucide-react';
import { Memory } from '../types/Memory';
import { Link } from "react-router-dom";

interface MemoryCardProps {
    memory: Memory;
    className?: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, className }) => {
    const firstMedia = memory.media[0];
    const TypeIcon = firstMedia.type === 'photo'
        ? Image
        : firstMedia.type === 'video'
            ? Video
            : MapPin;

    const formatDate = (dateString: string) => {
        try {
            const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
            const date = new Date(year, month - 1, day);
            const monthNames = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            return `${day} ${monthNames[date.getMonth()]} ${year}`;
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return dateString;
        }
    };

    return (
        <div
            className={`
                relative
                bg-white 
                rounded-xl sm:rounded-2xl 
                shadow-md 
                transition-all 
                duration-300 
                group 
                overflow-hidden 
                hover:shadow-lg
                ${className}
            `}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden">
                <img
                    src={firstMedia.type === 'video' ? firstMedia.thumbnail || firstMedia.url : firstMedia.url}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Media Type Icon */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                    <TypeIcon className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Media Count */}
                {memory.media.length > 1 && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
                        <span className="text-xs sm:text-sm font-medium text-blue-500">
                            {memory.media.length} media
                        </span>
                    </div>
                )}

                {/* Video Play Button */}
                {firstMedia.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="relative p-3 sm:p-4 flex flex-col min-h-[160px] sm:min-h-[180px]">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Title */}
                    <h2 className="text-md sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2">
                        {memory.title}
                    </h2>

                    {/* Description */}
                    {memory.description && (
                        <p className="text-xs sm:text-base text-gray-600 line-clamp-2 mb-2 sm:mb-3">
                            {memory.description}
                        </p>
                    )}

                    {/* Tags */}
                    {memory.tags && memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                            {memory.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-600
                                    rounded-full text-[9px] sm:text-xs font-medium gap-1"
                                >
                                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span>{formatDate(memory.date)}</span>
                    </div>
                    <Link
                        to={`/memory/${memory.id}`}
                        className="text-xs sm:text-sm text-blue-500 hover:text-blue-600 hover:underline
                        font-medium transition-colors"
                    >
                        Lihat Detail
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;