import React, { useState, useEffect, useCallback } from 'react';
import { X, Heart, Book, ChevronLeft, ChevronRight, Image, Play, AlertTriangle } from 'lucide-react';
import { useFetchMemories } from '../../hooks/useFetchMemories';
import '../styles/modal.css';
import '../styles/customScrollbar.css';
import { Memory } from '../../types/Memory';

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
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Use the custom hook to fetch memories
    const {
        data: memories,
        isLoading: memoriesLoading,
        error: memoriesError,
        refetch
    } = useFetchMemories();

    // Handle modal animation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Delay setting modal open for entrance animation
            const timer = setTimeout(() => {
                setIsModalOpen(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            // Start closing animation
            setIsModalOpen(false);
            // Wait for animation to complete before completely hiding
            const timer = setTimeout(() => {
                document.body.style.overflow = 'unset';
            }, 300); // Match with CSS transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const generateCloudinaryThumbnail = (videoUrl: string): string => {
        const cloudinaryUrl = videoUrl.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_jpg/');
        return cloudinaryUrl.replace('.mp4', '.jpg');
    };

    const messages: Message[] = [
        {
            date: '27 September 2024',
            content: 'Hari pertama kita resmi menjadi sepasang kekasih. Hari yang tidak akan pernah terlupakan ❤️',
            memoryId: null
        },
        {
            date: '15 Oktober 2024',
            content: 'First date kita di mall, nonton bareng dan makan siang. Kamu terlihat sangat cantik hari itu 😊',
            memoryId: memories?.[0]?.id || null
        },
        {
            date: '20 November 2024',
            content: 'Kita pergi ke pantai bersama. Sunset yang indah, tapi tidak seindah senyumanmu 🌅',
            memoryId: memories?.[1]?.id || null
        },
        {
            date: '15 Januari 2025',
            content: 'Mall date yang seru banget, jalan-jalan ke Miniso dan makan bareng 🛍️',
            memoryId: memories?.[2]?.id || null
        },
        {
            date: '20 Januari 2025',
            content: 'Photo booth bareng, mengabadikan moment indah kita berdua 📸',
            memoryId: memories?.[3]?.id || null
        },
        {
            date: '25 Januari 2025',
            content: 'Coffee date yang bikin waktu berlalu begitu cepat ☕',
            memoryId: memories?.[4]?.id || null
        },
        {
            date: '30 Januari 2025',
            content: 'Adventure seru di Ragunan, walaupun kamu ngambek tapi tetep gemesin 🦁',
            memoryId: memories?.[5]?.id || null
        }
    ];

    const handleMemoryClick = useCallback((memoryId: string | null) => {
        if (memoryId && memories) {
            const memory = memories.find(m => m.id === memoryId);
            if (memory) {
                setSelectedMemory(memory);
                setCurrentMediaIndex(0);
                setIsLoading(true);
                
                // Add slide-in animation for gallery view
                setTimeout(() => {
                    setShowGallery(true);
                }, 50);
            }
        }
    }, [memories]);

    const handleNextMedia = useCallback(() => {
        if (selectedMemory) {
            // Add a subtle fade transition
            setIsLoading(true);
            setTimeout(() => {
                setCurrentMediaIndex((prev) =>
                    prev === selectedMemory.media.length - 1 ? 0 : prev + 1
                );
            }, 150);
        }
    }, [selectedMemory]);

    const handlePrevMedia = useCallback(() => {
        if (selectedMemory) {
            // Add a subtle fade transition
            setIsLoading(true);
            setTimeout(() => {
                setCurrentMediaIndex((prev) =>
                    prev === 0 ? selectedMemory.media.length - 1 : prev - 1
                );
            }, 150);
        }
    }, [selectedMemory]);

    const handleMediaLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleBackToNotes = useCallback(() => {
        // Slide-out animation for gallery
        setShowGallery(false);
    }, []);

    if (!isOpen && !isModalOpen) return null;

    if (memoriesLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white p-6 rounded-lg shadow-xl animate-pulse">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                </div>
            </div>
        );
    }

    if (memoriesError) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p className="text-red-500 mb-4">Gagal memuat kenangan. Silakan coba lagi.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
                    isModalOpen ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
            />

            <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 transition-all duration-300 ${
                    isModalOpen ? 'opacity-100' : 'opacity-0'
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className={`relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                        isModalOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
                    }`}
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
                                                ${message.memoryId ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : ''} 
                                                animate-fadeInUp`}
                                            style={{ animationDelay: `${index * 0.05}s` }}
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
                            // Gallery View with slide animation
                            <div className={`h-full bg-gray-900 transition-transform duration-300 ${showGallery ? 'translate-x-0' : 'translate-x-full'}`}>
                                {selectedMemory && (
                                    <div className="h-full flex flex-col">
                                        {/* Main Media */}
                                        <div className="relative flex-1 flex items-center justify-center bg-gray-100 backdrop-blur-md min-h-0">
                                            {isLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                            {selectedMemory.media[currentMediaIndex]?.type === 'photo' ? (
                                                <img
                                                    src={selectedMemory.media[currentMediaIndex]?.url}
                                                    alt={`${selectedMemory.title} ${currentMediaIndex + 1}`}
                                                    className={`max-h-full max-w-full object-contain transition-opacity duration-300 
                                                        ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                                    onLoad={handleMediaLoad}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    autoPlay
                                                    className={`max-h-full max-w-full object-contain transition-opacity duration-300 
                                                        ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                                    onLoadedData={handleMediaLoad}
                                                >
                                                    <source src={selectedMemory.media[currentMediaIndex]?.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}

                                            {selectedMemory.media.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={handlePrevMedia}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                                        aria-label="Previous media"
                                                    >
                                                        <ChevronLeft className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={handleNextMedia}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                                        aria-label="Next media"
                                                    >
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="bg-gradient-to-b from-red-100 via-red-200 to-red-300 p-4">
                                            <div className="flex gap-2 p-0.5 overflow-x-auto custom-scrollbar">
                                                {selectedMemory.media.map((media, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setIsLoading(true);
                                                            setCurrentMediaIndex(index);
                                                        }}
                                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 
                                                            ${currentMediaIndex === index ? 'border-blue-500 scale-105' : 'border-transparent hover:border-blue-400'}`}
                                                        aria-label={`View media ${index + 1}`}
                                                        aria-current={currentMediaIndex === index}
                                                    >
                                                        {media.type === 'photo' ? (
                                                            <img
                                                                src={media.url}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    src={generateCloudinaryThumbnail(media.url)}
                                                                    alt={`Thumbnail ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                    <Play className="w-6 h-6 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
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

export default React.memo(NotebookModal);