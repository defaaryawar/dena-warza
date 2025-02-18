import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface Story {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    fullStory: string;
}

interface ModalProps {
    story: Story;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = React.memo(({ story, onClose }) => {
    const handleCardClick = () => {}

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <Card
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={handleCardClick}
            >
                <CardContent className="p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <X size={24} className="text-gray-600 hover:text-gray-900" />
                    </button>

                    <div className="flex items-center mb-6 space-x-4">
                        {story.icon}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{story.title}</h2>
                            <span className="text-sm text-gray-600">{story.date}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-700 text-lg leading-relaxed italic">
                            "{story.description}"
                        </p>
                        <p className="text-gray-800 text-lg leading-relaxed">
                            {story.fullStory}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

export default Modal;