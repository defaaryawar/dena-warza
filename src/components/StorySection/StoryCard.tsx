import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Story {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    fullStory: string;
    color: string;
    hoverColor: string;
}

interface StoryCardProps {
    story: Story;
    index: number;
    setActiveIndex: (index: number) => void;
    setSelectedStory: (story: Story | null) => void;
    isMobile: boolean;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(({ story, index, setActiveIndex, setSelectedStory, isMobile }) => {
    const handleMouseEnter = () => !isMobile && setActiveIndex(index);
    const handleTouchStart = () => isMobile && setActiveIndex(index);
    const handleClick = () => setSelectedStory(story);

    return (
        <div
            className={`relative ${story.color} rounded-3xl p-6 shadow-lg transition-all duration-500 transform 
            ${!isMobile ? `hover:-translate-y-2 hover:shadow-xl ${story.hoverColor}` : 'active:bg-opacity-90'}`}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
        >
            <div className="flex items-center mb-2 space-x-4">
                {story.icon}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{story.title}</h3>
                    <span className="text-sm text-gray-600">{story.date}</span>
                </div>
            </div>
            <p className="text-gray-700 leading-relaxed mb-16">{story.description}</p>
            <button
                onClick={handleClick}
                className={`flex items-center space-x-2 absolute bottom-6 bg-white/40 text-gray-900 font-semibold 
                py-2 px-4 rounded-full transition-all duration-300 
                ${!isMobile ? 'hover:bg-white/60' : 'active:bg-white/60'}`}
            >
                <span>Baca Selengkapnya</span>
                <ChevronRight size={16} />
            </button>
        </div>
    );
});

export default StoryCard;