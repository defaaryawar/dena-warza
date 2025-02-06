import React, { useState } from 'react';
import { memories } from '../data/dataImage';
import AlbumHeader from './Navbar';

const Album: React.FC = () => {
    const [filters, setFilters] = useState({
        type: 'all' as 'all' | 'photo' | 'video',
        date: '',
        view: 'grid' as 'grid' | 'list',
        sort: 'newest' as 'newest' | 'oldest'
    });

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Calculate media stats
    const mediaStats = {
        total: memories.reduce((acc, memory) => acc + memory.media.length, 0),
        photos: memories.reduce((acc, memory) =>
            acc + memory.media.filter(m => m.type === 'photo').length, 0),
        videos: memories.reduce((acc, memory) =>
            acc + memory.media.filter(m => m.type === 'video').length, 0)
    };

    return (
        <AlbumHeader
            onFilterChange={handleFilterChange}
            totalMemories={memories.length}
            mediaStats={mediaStats}
        />
    );
};

export default Album;