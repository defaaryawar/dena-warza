import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Search,
    Calendar,
    Image as ImageIcon,
    Video,
    Settings2,
    GridIcon,
    List,
    SlidersHorizontal,
    X,
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
    onFilterChange,
    totalMemories,
}) => {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleNavigateToSearch = () => {
        navigate('/search');
    };

    const handleTypeChange = (type: 'all' | 'photo' | 'video') => {
        setSelectedType(type);
        onFilterChange({ type });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        onFilterChange({ date: e.target.value });
    };

    const toggleView = (view: 'grid' | 'list') => {
        setViewMode(view);
        onFilterChange({ view });
    };

    const handleSort = (sort: 'newest' | 'oldest') => {
        setSortBy(sort);
        onFilterChange({ sort });
    };

    return (
        <div className="bg-white shadow-lg rounded-xl mb-8 sticky top-4 z-990">
            <div className="container mx-auto px-4 py-4">
                {/* Main Header Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Left Section: Title and Stats */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                        {/* Search Bar */}
                        <div className="relative flex-1 md:max-w-xs" onClick={handleNavigateToSearch}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <div
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-100 transition-all text-gray-500"
                            >
                                Cari kenangan...
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="hidden md:flex bg-gray-100 p-1 rounded-full">
                            <button
                                onClick={() => toggleView('grid')}
                                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid'
                                        ? 'bg-white text-blue-600 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <GridIcon size={18} />
                            </button>
                            <button
                                onClick={() => toggleView('list')}
                                className={`p-1.5 rounded-full transition-all ${viewMode === 'list'
                                        ? 'bg-white text-blue-600 shadow'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`p-2 rounded-full transition-all ${isFilterOpen
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {isFilterOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
                        </button>

                        {/* Settings Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                            >
                                <Settings2 size={20} />
                            </button>
                            {isSettingsOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                                    <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">
                                        Urutkan
                                    </div>
                                    <button
                                        onClick={() => handleSort('newest')}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${sortBy === 'newest' ? 'text-blue-500' : 'text-gray-700'
                                            }`}
                                    >
                                        Terbaru
                                    </button>
                                    <button
                                        onClick={() => handleSort('oldest')}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${sortBy === 'oldest' ? 'text-blue-500' : 'text-gray-700'
                                            }`}
                                    >
                                        Terlama
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Media Type Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Tipe Media</label>
                                <div className="flex gap-2">
                                    {[
                                        { type: 'all', label: 'Semua' },
                                        { type: 'photo', label: 'Foto', icon: ImageIcon },
                                        { type: 'video', label: 'Video', icon: Video }
                                    ].map(({ type, label, icon: Icon }) => (
                                        <button
                                            key={type}
                                            onClick={() => handleTypeChange(type as any)}
                                            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all ${selectedType === type
                                                    ? 'bg-blue-500 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {Icon && <Icon size={16} />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-500">Tanggal</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="month"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumHeader;