import React from 'react';
import { Image, Video, MapPin, Calendar, Tag } from 'lucide-react';
import { Memory } from '../types/Memory';
import { Link } from "react-router-dom";

interface MemoryCardProps {
    memory: Memory;
    className?: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, className }) => {
    // Ambil media pertama untuk thumbnail
    const firstMedia = memory.media[0];

    // Pilih ikon berdasarkan tipe media pertama
    const TypeIcon = firstMedia.type === 'photo'
        ? Image
        : firstMedia.type === 'video'
            ? Video
            : MapPin;

    const formatDate = (dateString: string) => {
        console.log('Formatting date:', dateString);
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
                w-full sm:w-80 md:w-96 lg:w-[calc(25%-1rem)]
                bg-white 
                rounded-2xl 
                shadow-lg 
                transition-all 
                duration-300 
                group 
                overflow-hidden 
                ${className}
            `}
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={firstMedia.type === 'video' ? firstMedia.thumbnail || firstMedia.url : firstMedia.url}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2">
                    <TypeIcon className="text-blue-500" size={20} />
                </div>
                {memory.media.length > 1 && (
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-blue-500">
                        {memory.media.length} media
                    </div>
                )}
                {firstMedia.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Video className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                )}
            </div>

            {/* Konten Memori */}
            <div className="relative p-4 flex flex-col min-h-[180px]">
                {/* Konten Utama */}
                <div className="flex-1">
                    {/* Judul */}
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{memory.title}</h2>

                    {/* Deskripsi */}
                    {memory.description && (
                        <p className="text-gray-600 line-clamp-none mb-3">{memory.description}</p>
                    )}

                    {/* Tag Memori */}
                    {memory.tags && memory.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {memory.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="
                                        inline-flex 
                                        items-center 
                                        px-2 
                                        py-1 
                                        bg-blue-100 
                                        text-blue-600
                                        rounded-full 
                                        text-[10px] 
                                        font-medium
                                        gap-1
                                        mb-3
                                    "
                                >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer - Selalu di bawah */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(memory.date)}</span>
                    </div>
                    <Link to={`/memory/${memory.id}`} className="text-blue-500 hover:underline text-xs">
                        Lihat Detail
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;