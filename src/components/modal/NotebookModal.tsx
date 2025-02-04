import React, { useState, useEffect } from 'react';
import { X, Heart, Book, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import '../styles/modal.css';
import '../styles/customScrollbar.css';
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
    const [isLoading, setIsLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsLoading(true);
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
            date: '27 September 2024',
            content: 'Hari pertama kita resmi menjadi sepasang kekasih. Hari yang tidak akan pernah terlupakan ❤️',
            memoryId: null
        },
        {
            date: '15 Oktober 2024',
            content: 'First date kita di mall, nonton bareng dan makan siang. Kamu terlihat sangat cantik hari itu 😊',
            memoryId: '2'
        },
        {
            date: '20 November 2024',
            content: 'Kita pergi ke pantai bersama. Sunset yang indah, tapi tidak seindah senyumanmu 🌅',
            memoryId: '1'
        },
        {
            date: '15 Januari 2025',
            content: 'Mall date yang seru banget, jalan-jalan ke Miniso dan makan bareng 🛍️',
            memoryId: '3'
        },
        {
            date: '20 Januari 2025',
            content: 'Photo booth bareng, mengabadikan moment indah kita berdua 📸',
            memoryId: '4'
        },
        {
            date: '25 Januari 2025',
            content: 'Coffee date yang bikin waktu berlalu begitu cepat ☕',
            memoryId: '5'
        },
        {
            date: '30 Januari 2025',
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
                setIsLoading(true);
                setShowGallery(true);
            }
        }
    };

    const handleNextImage = () => {
        if (selectedMemory) {
            setCurrentImageIndex((prev) =>
                prev === selectedMemory.media.length - 1 ? 0 : prev + 1
            );
            setIsLoading(true);
        }
    };

    const handlePrevImage = () => {
        if (selectedMemory) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedMemory.media.length - 1 : prev - 1
            );
            setIsLoading(true);
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleBackToNotes = () => {
        setShowGallery(false);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fadeIn"
                aria-hidden="true"
            />

            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-modalEnter"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 sm:p-6 text-white sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {showGallery && (
                                    <button
                                        onClick={handleBackToNotes}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors mr-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <Book className="w-5 h-5 sm:w-6 sm:h-6" />
                                <h2 id="modal-title" className="text-lg sm:text-xl font-bold">
                                    {showGallery && selectedMemory ? selectedMemory.title : 'Our Notebook'}
                                </h2>
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

                    <div className="h-[calc(90vh-88px)] overflow-hidden">
                        {!showGallery ? (
                            // Notes View
                            <div className="h-full p-4 sm:p-6 overflow-y-auto custom-scrollbar messages-scroll">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`bg-gradient-to-r from-pink-50 to-purple-50 p-3 sm:p-4 rounded-xl shadow-sm transition-all duration-300 
                                                ${message.memoryId ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : ''}`}
                                            onClick={() => handleMemoryClick(message.memoryId)}
                                            role={message.memoryId ? 'button' : 'none'}
                                            tabIndex={message.memoryId ? 0 : -1}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <Heart className="w-5 h-5 text-pink-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-500 mb-1">
                                                        {message.date}
                                                    </div>
                                                    <p className="text-gray-800 leading-relaxed break-words">
                                                        {message.content}
                                                    </p>
                                                    {message.memoryId && (
                                                        <div className="mt-2 text-sm text-blue-500 flex items-center gap-1">
                                                            <Image className="w-4 h-4" />
                                                            <span>View photos</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Gallery View
                            <div className="h-full bg-gray-900">
                                {selectedMemory && (
                                    <div className="h-full flex flex-col">
                                        {/* Main Image */}
                                        <div className="relative flex-1 flex items-center justify-center bg-black min-h-0">
                                            {isLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                            <img
                                                src={selectedMemory.media[currentImageIndex].url}
                                                alt={`${selectedMemory.title} ${currentImageIndex + 1}`}
                                                className={`max-h-full max-w-full object-contain transition-opacity duration-300 
                                                    ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                                onLoad={handleImageLoad}
                                            />

                                            {selectedMemory.media.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={handlePrevImage}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={handleNextImage}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="bg-gray-800 p-4">
                                            <div className="flex gap-2 p-0.5 overflow-x-auto custom-scrollbar">
                                                {selectedMemory.media.map((media, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setIsLoading(true);
                                                            setCurrentImageIndex(index);
                                                        }}
                                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 
                                                            ${currentImageIndex === index ? 'border-blue-500 scale-105' : 'border-transparent hover:border-blue-400'}`}
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
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotebookModal;