import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Plus, Edit, Menu, X } from 'lucide-react';

interface AlbumHeaderProps {
    totalMemories: number;
}

const AlbumHeader: React.FC<AlbumHeaderProps> = ({ totalMemories }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Performance optimization with useCallback
    const handleNavigateToSearch = useCallback(() => {
        navigate('/search');
    }, [navigate]);

    const handleNavigateToAddMemory = useCallback(() => {
        navigate('/add-memory');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    const handleNavigateToEditMemory = useCallback(() => {
        navigate('/edit-memory');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, [navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="bg-white shadow-lg rounded-xl mb-8 sticky top-4 z-990">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Cerita Kita
                        </h1>
                        <Heart className="text-pink-500 animate-pulse" size={24} />
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                            {totalMemories} Memories
                        </span>

                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Desktop Dropdown */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm hover:from-blue-600 hover:to-purple-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Kenangan
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-5">
                                    <div className="divide-y divide-gray-100">
                                        <button
                                            onClick={handleNavigateToAddMemory}
                                            className="w-full px-4 py-3 text-left text-sm cursor-pointer text-gray-700 hover:bg-gray-50 flex items-center gap-2 group transition-colors"
                                        >
                                            <Plus className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                            Tambah Kenangan
                                        </button>
                                        <button
                                            onClick={handleNavigateToEditMemory}
                                            className="w-full px-4 py-3 text-left text-sm cursor-pointer text-gray-700 hover:bg-gray-50 flex items-center gap-2 group transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                                            Edit Kenangan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="relative" onClick={handleNavigateToSearch}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari kenangan..."
                                className="w-48 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-100 transition-all"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 top-[73px] bg-white z-990 md:hidden animate-in slide-in-from-right">
                        <div className="p-4 space-y-4">
                            <div onClick={handleNavigateToSearch} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari kenangan..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm"
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handleNavigateToAddMemory}
                                    className="w-full px-4 py-3 text-left text-sm bg-gray-50 rounded-xl hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-blue-500" />
                                    Tambah Kenangan
                                </button>
                                <button
                                    onClick={handleNavigateToEditMemory}
                                    className="w-full px-4 py-3 text-left text-sm bg-gray-50 rounded-xl hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                >
                                    <Edit className="w-4 h-4 text-purple-500" />
                                    Edit Kenangan
                                </button>
                            </div>

                            <div className="pt-2">
                                <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                                    {totalMemories} Memories
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumHeader;