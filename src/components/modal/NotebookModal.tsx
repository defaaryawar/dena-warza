import React, { useState, useEffect } from 'react';
import { X, Heart, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../customScrollBar/customScrollbar.css';
import { memories } from '../../data/dataImage';
import type { Memory } from '../../types/Memory';

interface NotebookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    date: string;
    content: string;
    memoryId: string | null;
}

const NotebookModal: React.FC<NotebookModalProps> = ({ isOpen, onClose }) => {
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const messages: Message[] = [
        {
            date: '27 September 2023',
            content: 'Hari pertama kita resmi menjadi sepasang kekasih. Hari yang tidak akan pernah terlupakan ❤️',
            memoryId: null
        },
        {
            date: '15 Oktober 2023',
            content: 'First date kita di mall, nonton bareng dan makan siang. Kamu terlihat sangat cantik hari itu 😊',
            memoryId: '2'
        },
        {
            date: '20 November 2023',
            content: 'Kita pergi ke pantai bersama. Sunset yang indah, tapi tidak seindah senyumanmu 🌅',
            memoryId: '1'
        },
        {
            date: '15 Januari 2024',
            content: 'Mall date yang seru banget, jalan-jalan ke Miniso dan makan bareng 🛍️',
            memoryId: '3'
        },
        {
            date: '20 Januari 2024',
            content: 'Photo booth bareng, mengabadikan moment indah kita berdua 📸',
            memoryId: '4'
        },
        {
            date: '25 Januari 2024',
            content: 'Coffee date yang bikin waktu berlalu begitu cepat ☕',
            memoryId: '5'
        },
        {
            date: '30 Januari 2024',
            content: 'Adventure seru di Ragunan, walaupun kamu ngambek tapi tetep gemesin 🦁',
            memoryId: '6'
        }
    ];

    const handleMemoryClick = (memoryId: string | null) => {
        if (memoryId) {
            const memory = memories.find(m => m.id === memoryId);
            if (memory) {
                setSelectedMemory(memory);
                setCurrentImageIndex(0);
            }
        }
    };

    const handleNextImage = () => {
        if (selectedMemory) {
            setCurrentImageIndex((prev) =>
                prev === selectedMemory.media.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handlePrevImage = () => {
        if (selectedMemory) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedMemory.media.length - 1 : prev - 1
            );
        }
    };

    // Handle click outside modal
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={handleOverlayClick}
            >
                <div
                    className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Book className="w-6 h-6" />
                                <h2 id="modal-title" className="text-xl font-bold">Our Notebook</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex h-[calc(90vh-88px)]">
                        {/* Messages Section */}
                        <div className="w-1/2 p-6 overflow-y-auto border-r custom-scrollbar">
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${message.memoryId ? 'hover:shadow-md' : ''
                                            }`}
                                        onClick={() => handleMemoryClick(message.memoryId)}
                                        role={message.memoryId ? 'button' : 'none'}
                                        tabIndex={message.memoryId ? 0 : -1}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <Heart className="w-5 h-5 text-pink-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">
                                                    {message.date}
                                                </div>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {message.content}
                                                </p>
                                                {message.memoryId && (
                                                    <div className="mt-2 text-sm text-blue-500">
                                                        Click to view photos →
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Gallery Section */}
                        <div className="w-1/2 p-6 overflow-y-auto bg-gray-50 custom-scrollbar-dark">
                            {selectedMemory ? (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {selectedMemory.title}
                                    </h3>
                                    <p className="text-gray-600">{selectedMemory.description}</p>

                                    {/* Image Viewer */}
                                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                        <img
                                            src={selectedMemory.media[currentImageIndex].url}
                                            alt={`${selectedMemory.title} ${currentImageIndex + 1}`}
                                            className="w-full h-full object-contain"
                                        />

                                        {selectedMemory.media.length > 1 && (
                                            <>
                                                <button
                                                    onClick={handlePrevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={handleNextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnail Strip */}
                                    <div className="flex gap-2 overflow-x-auto py-2 custom-scrollbar-horizontal">
                                        {selectedMemory.media.map((media, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${currentImageIndex === index
                                                        ? 'border-blue-500'
                                                        : 'border-transparent'
                                                    }`}
                                                aria-label={`View image ${index + 1}`}
                                                aria-current={currentImageIndex === index}
                                            >
                                                <img
                                                    src={media.url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Select a memory to view photos</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotebookModal;