import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { memories } from '../data/dataImage';
import { Search, ArrowLeft, Calendar, Heart, Tag } from 'lucide-react';

const SearchMemories = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const filteredMemories = useMemo(() => {
        if (!searchQuery) return [];

        const query = searchQuery.toLowerCase();
        return memories.filter(memory =>
            memory.title.toLowerCase().includes(query) ||
            memory.description.toLowerCase().includes(query) ||
            memory.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    return (
        <div className="container mx-auto max-w-7xl">
            {/* Search Header with gradient background */}
            <div className="bg-white shadow-lg rounded-xl mb-8 sticky top-4 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
                <div className="container mx-auto px-4 py-4 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/50 rounded-full transition-all group"
                        >
                            <ArrowLeft className="text-gray-600 group-hover:scale-110 transition-transform" size={24} />
                        </button>

                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari kenangan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Stats */}
            {searchQuery && (
                <div className="mb-6 text-center animate-fade-in">
                    <p className="text-gray-600">
                        Ditemukan {filteredMemories.length} kenangan
                        {searchQuery && ` untuk "${searchQuery}"`}
                    </p>
                </div>
            )}

            {/* Search Results with animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMemories.map((memory, index) => (
                    <div
                        key={memory.id}
                        onClick={() => navigate(`/memory/${memory.id}`)}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="relative overflow-hidden">
                            {memory.media && memory.media[0] && (
                                <img
                                    src={memory.media[0].url}
                                    alt={memory.title}
                                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar size={16} />
                                    <span className="text-sm">{memory.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                    {memory.title}
                                </h3>
                                <Heart className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{memory.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {memory.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                                    >
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State with illustration */}
            {filteredMemories.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <div className="max-w-sm mx-auto">
                        <div className="mb-6 relative">
                            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                                <Search className="text-blue-500" size={32} />
                            </div>
                            <div className="absolute -bottom-2 right-1/3 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <Heart className="text-pink-500" size={16} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery ? 'Tidak ada kenangan ditemukan' : 'Mulai mencari kenangan'}
                        </h3>
                        <p className="text-gray-600">
                            {searchQuery
                                ? `Tidak ada memories yang cocok dengan "${searchQuery}". Coba kata kunci lain?`
                                : 'Ketik untuk mencari kenangan berdasarkan judul, deskripsi, atau tag.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchMemories;