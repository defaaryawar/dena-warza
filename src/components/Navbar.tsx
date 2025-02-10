import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Search,
    Plus,
} from 'lucide-react';

interface AlbumHeaderProps {
    onFilterChange: (filters: {
        type?: 'all' | 'photo' | 'video';
        date?: string;
        view?: 'grid' | 'list';
        sort?: 'newest' | 'oldest';
    }) => void;
    totalMemories: number;
    mediaStats: {
        total: number;
        photos: number;
        videos: number;
    };
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({
    totalMemories,
}) => {
    const navigate = useNavigate();

    const handleNavigateToSearch = () => {
        navigate('/search');
    };

    const handleNavigateToAddMemory = () => {
        navigate('/add-memory');
    };

    return (
        <div className="bg-white shadow-lg rounded-xl mb-8 sticky top-4 z-990">
            <div className="container mx-auto px-4 py-4">
                {/* Main Header Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Left Section: Title and Stats */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Cerita Kita
                            </h1>
                            <Heart className="text-pink-500 animate-pulse" size={24} />
                        </div>
                        <div className="hidden md:flex items-center text-sm text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                                {totalMemories} Memories
                            </span>
                        </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:justify-end">
                        {/* Add Memory Button */}
                        <button 
                            onClick={handleNavigateToAddMemory}
                            className="bg-gradient-to-r cursor-pointer md:text-sm text-xs from-blue-500 to-purple-600 text-white py-2 md:hover:bg-gradient-to-r md:hover:from-blue-600 md:hover:to-purple-700 rounded-full flex items-center justify-center px-4"
                            title="Tambah Kenangan Baru"
                        >
                            Tambah Kenangan
                            <Plus className='md:w-5 md:h-5 w-3.5 h-3.5' />
                        </button>

                        {/* Search Bar */}
                        <div className="relative flex-1 md:max-w-xs" onClick={handleNavigateToSearch}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="md:w-5 md:h-5 w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full md:text-sm text-xs cursor-pointer hover:bg-gray-100 transition-all text-gray-500"
                            >
                                Cari kenangan...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumHeader;