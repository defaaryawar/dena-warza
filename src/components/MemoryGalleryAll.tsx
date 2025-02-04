import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import MemoryCard from './MemoryCardTerbaru';

import { memories } from '../data/dataImage'; // Adjust import path as needed

const MemoryGalleryAll: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [displayCount, setDisplayCount] = useState(8);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    // Advanced tag extraction with sorting
    const allTags = useMemo(() => {
        const tags = Array.from(new Set(
            memories.flatMap(memory => memory.tags || [])
        ));

        // Sort tags alphabetically
        return tags.sort((a, b) => a.localeCompare(b));
    }, []);

    // Advanced filtering with more comprehensive search
    const filteredMemories = useMemo(() => {
        return memories.filter(memory => {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();

            // Comprehensive search across multiple fields
            const matchesSearch =
                !normalizedSearchTerm ||
                memory.title.toLowerCase().includes(normalizedSearchTerm) ||
                (memory.description &&
                    memory.description.toLowerCase().includes(normalizedSearchTerm)) ||
                (memory.tags &&
                    memory.tags.some(tag =>
                        tag.toLowerCase().includes(normalizedSearchTerm)
                    ));

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.every(tag => memory.tags?.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [searchTerm, selectedTags]);

    // Pagination logic
    const displayedMemories = useMemo(() =>
        filteredMemories.slice(0, displayCount),
        [filteredMemories, displayCount]
    );

    // Toggle tag selection with more intuitive logic
    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => {
            const isSelected = prev.includes(tag);
            return isSelected
                ? prev.filter(t => t !== tag)
                : [...prev, tag];
        });
        // Reset display count when filtering changes
        setDisplayCount(8);
    };

    // Load more functionality
    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 8);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setDisplayCount(8);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Enhanced Search and Filter Section */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
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
                            className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            transition-all duration-300 ease-in-out"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Advanced Filter Dropdown */}
                    <div className="relative">
                        <div
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            className="btn btn-outline btn-primary flex items-center cursor-pointer"
                        >
                            <Filter className="mr-2" />
                            Filter
                            {isFilterExpanded ? (
                                <ChevronUp className="ml-2" />
                            ) : (
                                <ChevronDown className="ml-2" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Expandable Filter Tags Section */}
                {isFilterExpanded && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Filter by Tags</h3>
                            {(searchTerm || selectedTags.length > 0) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`
                                        px-3 py-1 rounded-full text-sm transition-all duration-200
                                        ${selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                        }
                                    `}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Tags Display */}
                {(selectedTags.length > 0 || searchTerm) && (
                    <div className="flex flex-wrap gap-2">
                        {selectedTags.map(tag => (
                            <div
                                key={tag}
                                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                                <button
                                    onClick={() => handleTagToggle(tag)}
                                    className="ml-2 hover:text-blue-900"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {searchTerm && (
                            <div
                                className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                                "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-2 hover:text-gray-900"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Memory Grid with Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedMemories.length > 0 ? (
                    displayedMemories.map(memory => (
                        <MemoryCard
                            key={memory.id}
                            memory={memory}
                            className="w-full transition-transform duration-300 hover:scale-105"
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        <p className="text-xl">No memories found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Load More Button with Dynamic Visibility */}
            {displayedMemories.length < filteredMemories.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="btn btn-outline btn-primary transition-all duration-300 hover:bg-blue-500 hover:text-white"
                    >
                        Load More Memories
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryGalleryAll;