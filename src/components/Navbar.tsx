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
    const [animationState, setAnimationState] = useState('closed');

    // Performance optimization with useCallback
    const handleNavigateToSearch = useCallback(() => {
        navigate('/search');
        // Close mobile menu if open
        if (isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }, [navigate, isMobileMenuOpen]);

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

    // Toggle mobile menu with animation states
    const toggleMobileMenu = () => {
        if (isMobileMenuOpen) {
            setAnimationState('closing');
            setTimeout(() => {
                setIsMobileMenuOpen(false);
                setAnimationState('closed');
            }, 300); // Match this with your CSS transition duration
        } else {
            setIsMobileMenuOpen(true);
            setAnimationState('opening');
            setTimeout(() => {
                setAnimationState('open');
            }, 50);
        }
    };

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
        <div className="bg-white shadow-lg rounded-xl sticky top-4 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Cerita Kita
                        </h1>
                        <Heart className="text-pink-500 animate-pulse" size={24} />
                    </div>

                    {/* Memory Count - Right aligned on mobile */}
                    <div className="flex items-center md:hidden">
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                            {totalMemories} Memories
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Memory Count */}
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                            {totalMemories} Memories
                        </span>

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
                        <div
                            className="relative cursor-pointer"
                            onClick={handleNavigateToSearch}
                        >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <div
                                className="w-48 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm hover:bg-gray-100 transition-all"
                            >
                                Cari kenangan...
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay Background */}
                        <div
                            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${animationState === 'opening' || animationState === 'open' ? 'opacity-100' : 'opacity-0'
                                }`}
                            onClick={toggleMobileMenu}
                        />

                        {/* Mobile Menu */}
                        <div
                            className={`fixed inset-x-0 bottom-0 top-auto bg-white z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ${animationState === 'opening' || animationState === 'open'
                                    ? 'translate-y-0'
                                    : 'translate-y-full'
                                }`}
                        >
                            {/* Menu Handle */}
                            <div className="w-full flex justify-center pt-3 pb-1">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Header with Memory count right-aligned */}
                                <div className="flex justify-end">
                                    <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                        {totalMemories} Memories
                                    </span>
                                </div>

                                {/* Search Bar - Now a div instead of input */}
                                <div
                                    onClick={handleNavigateToSearch}
                                    className="relative cursor-pointer"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base shadow-sm flex items-center"
                                    >
                                        Cari kenangan...
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={handleNavigateToAddMemory}
                                        className="w-full px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white flex items-center justify-center gap-3 hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="text-base font-medium">Tambah Kenangan</span>
                                    </button>

                                    <button
                                        onClick={handleNavigateToEditMemory}
                                        className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <Edit className="w-5 h-5 text-purple-500" />
                                        <span className="text-base font-medium text-gray-700">Edit Kenangan</span>
                                    </button>
                                </div>

                                {/* Cerita Kita Branding - Bottom */}
                                <div className="pt-8 flex items-center justify-end opacity-75">
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Cerita Kita
                                    </h2>
                                    <Heart className="text-pink-500 ml-1" size={16} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AlbumHeader;