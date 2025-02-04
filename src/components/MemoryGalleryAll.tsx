import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import MemoryCard from './MemoryCardTerbaru';
import { memories } from '../data/dataImage';

const MemoryGalleryAll: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(8);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    // Advanced tag extraction with sorting
    const allTags = useMemo(() => {
        const tags = Array.from(new Set(memories.flatMap(memory => memory.tags || [])));
        return tags.sort((a, b) => a.localeCompare(b));
    }, []);

    const filteredMemories = useMemo(() => {
        return memories.filter(memory => {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            const matchesSearch =
                !normalizedSearchTerm ||
                memory.title.toLowerCase().includes(normalizedSearchTerm) ||
                (memory.description && memory.description.toLowerCase().includes(normalizedSearchTerm)) ||
                (memory.tags && memory.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm)));

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some(tag => memory.tags?.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [searchTerm, selectedTags]);

    const displayedMemories = useMemo(() =>
        filteredMemories.slice(0, displayCount),
        [filteredMemories, displayCount]
    );

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => {
            const isSelected = prev.includes(tag);
            return isSelected ? prev.filter(t => t !== tag) : [...prev, tag];
        });
        setDisplayCount(8);
    };

    const handleLoadMore = () => setDisplayCount(prev => prev + 8);
    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setDisplayCount(8);
    };

    return (
        <div className="container mx-auto px-0 py-8">
            {/* Enhanced Search and Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input with Enhanced Styling */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search memories by title, description, or tags..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setDisplayCount(8);
                            }}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            transition-all duration-300 ease-in-out text-gray-700 bg-gray-50
                            placeholder:text-gray-400"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Enhanced Filter Button */}
                    <button
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                        flex items-center justify-center gap-2 font-medium
                        ${isFilterExpanded
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                            }`}
                    >
                        <Filter className={`w-5 h-5 ${isFilterExpanded ? 'text-blue-500' : ''}`} />
                        Filters
                        {isFilterExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Enhanced Expandable Filter Tags Section */}
                {isFilterExpanded && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-inner">
                        <div className="flex flex-wrap justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Filter by Tags</h3>
                            {(searchTerm || selectedTags.length > 0) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-red-500 hover:text-red-700 transition-colors
                                    flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                                        transition-all duration-300 ease-in-out
                                        hover:shadow-md transform hover:-translate-y-0.5
                                        ${selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
                                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                        }
                                    `}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Enhanced Selected Tags Display */}
                {(selectedTags.length > 0 || searchTerm) && (
                    <div className="flex flex-wrap gap-3 pt-4">
                        {selectedTags.map(tag => (
                            <div
                                key={tag}
                                className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 
                                rounded-lg text-sm font-medium shadow-sm border border-blue-100 "
                            >
                                {tag}
                                <button
                                    onClick={() => handleTagToggle(tag)}
                                    className="ml-2 hover:text-blue-900 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {searchTerm && (
                            <div className="flex items-center bg-gray-50 text-gray-700 px-4 py-2 
                            rounded-lg text-sm font-medium shadow-sm border border-gray-200">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 hover:text-gray-900 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Memory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedMemories.length > 0 ? (
                    displayedMemories.map(memory => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            className="w-full transform transition-transform duration-300 md:hover:-translate-y-0.5"
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl">
                        <div className="text-gray-400 mb-3">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-xl font-semibold text-gray-700">No memories found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Enhanced Load More Button */}
            {displayedMemories.length < filteredMemories.length && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleLoadMore}
                        className="group relative px-8 py-4 font-semibold text-blue-600 bg-white 
                        border-2 border-blue-600 rounded-xl transition-all duration-300 cursor-pointer
                        hover:bg-blue-600 hover:text-white hover:shadow-lg
                        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 flex items-center gap-3"
                    >
                        <span className="relative z-10">Load More Memories</span>
                        <ChevronDown className="w-5 h-5 transition-transform duration-300 
                        group-hover:translate-y-1 relative z-10" />
                        <div className="absolute inset-0 h-full w-0 bg-blue-600 
                        transition-all duration-300 ease-out group-hover:w-full rounded-xl" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryGalleryAll;