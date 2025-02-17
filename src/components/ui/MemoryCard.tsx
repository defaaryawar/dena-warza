import React from 'react';
import { Card } from './Card';
import { Memory } from '../../types/Memory';

interface MemoryCardProps {
    memory: Memory;
    onClick: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
    return (
        <Card
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={onClick}
        >
            <div className="relative overflow-hidden rounded-t-xl">
                {memory.media && memory.media[0] && (
                    <img
                        src={memory.media[0].url}
                        alt={memory.title}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{memory.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{memory.description}</p>
                <div className="flex flex-wrap gap-2">
                    {memory.tags.map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
};