import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, Heart, Book, ChevronLeft, ChevronRight, Image, Play, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../styles/modal.css';
import '../styles/customScrollbar.css';
import type { Memory } from '../../types/Memory';

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
    const navigate = useNavigate();
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
    const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
    const queryClient = useQueryClient();

    // Enhanced error handling for fetch
    const handleFetchError = useCallback((error: Error) => {
        if (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')) {
            sessionStorage.removeItem('authToken');
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
            navigate('/pin', { replace: true });
            return null;
        }

        if (error.message.includes('500')) {
            toast.error('Terjadi kesalahan server. Silakan coba lagi nanti.');
            return null;
        }

        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
            return null;
        }

        toast.error(`Gagal memuat kenangan: ${error.message}`);
        return null;
    }, [navigate]);

    // Fetch memories with comprehensive error handling
    const {
        data: memories,
        isLoading: memoriesLoading,
        error: memoriesError,
        refetch
    } = useQuery<Memory[], Error>(
        ['memories'],
        async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                const response = await fetch(`${API_URL}/api/memories`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                return response.json();
            } catch (err) {
                return handleFetchError(err as Error);
            }
        },
        {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            onError: (err: Error) => {
                handleFetchError(err);
            },
            select: (newData) => {
                const cachedData = queryClient.getQueryData<Memory[]>(['memories']);

                if (!cachedData) return newData;

                const isDataChanged = JSON.stringify(cachedData) !== JSON.stringify(newData);

                return isDataChanged ? newData : cachedData;
            }
        }
    );

    // Thumbnail generation functions
    const generateThumbnail = useCallback((video: HTMLVideoElement, videoUrl: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg');
        setThumbnails(prev => ({ ...prev, [videoUrl]: thumbnail }));
    }, []);

    const handleVideoLoad = useCallback((video: HTMLVideoElement, videoUrl: string) => {
        video.currentTime = 1;
        video.addEventListener('seeked', () => {
            generateThumbnail(video, videoUrl);
        }, { once: true });
    }, [generateThumbnail]);

    // Prevent body scroll when modal is open
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

    // Generate video thumbnails
    useEffect(() => {
        if (memories) {
            memories.forEach(memory => {
                memory.media.forEach(media => {
                    if (media.type === 'video' && !thumbnails[media.url] && !videoRefs.current[media.url]) {
                        const videoElement = document.createElement('video');
                        videoElement.crossOrigin = 'anonymous';
                        videoElement.src = media.url;
                        videoElement.load();
                        videoRefs.current[media.url] = videoElement;
                        videoElement.addEventListener('loadedmetadata', () => {
                            handleVideoLoad(videoElement, media.url);
                        });
                    }
                });
            });
        }

        return () => {
            Object.values(videoRefs.current).forEach(video => video.remove());
            videoRefs.current = {};
        };
    }, [memories, thumbnails, handleVideoLoad]);

    const messages: Message[] = useMemo(() => [
        {
            date: '27 September 2024',
            content: 'Hari pertama kita resmi menjadi sepasang kekasih. Hari yang tidak akan pernah terlupakan ❤️',
            memoryId: null
        },
        {
            date: '15 Oktober 2024',
            content: 'First date kita di mall, nonton bareng dan makan siang. Kamu terlihat sangat cantik hari itu 😊',
            memoryId: '0e490924-ddb4-4eac-961f-8ecd515622b5'
        },
        {
            date: '20 November 2024',
            content: 'Kita pergi ke pantai bersama. Sunset yang indah, tapi tidak seindah senyumanmu 🌅',
            memoryId: '9afde100-dade-465c-8f38-a4aa18999e9f'
        },
        {
            date: '15 Januari 2025',
            content: 'Mall date yang seru banget, jalan-jalan ke Miniso dan makan bareng 🛍️',
            memoryId: '339d579e-b873-4b14-be13-6b09531088c0'
        },
        {
            date: '20 Januari 2025',
            content: 'Photo booth bareng, mengabadikan moment indah kita berdua 📸',
            memoryId: '44c2a521-3386-4418-be43-c5d24d4f452d'
        },
        {
            date: '25 Januari 2025',
            content: 'Coffee date yang bikin waktu berlalu begitu cepat ☕',
            memoryId: 'e3595b3b-9e1e-41cc-8a1d-53fb1454657f'
        },
        {
            date: '30 Januari 2025',
            content: 'Adventure seru di Ragunan, walaupun kamu ngambek tapi tetep gemesin 🦁',
            memoryId: '593e838e-a1eb-4e2c-9f33-584c3098652a'
        }
    ], []);

    const handleMemoryClick = useCallback((memoryId: string | null) => {
        if (memoryId && memories) {
            const memory = memories.find(m => m.id === memoryId);
            if (memory) {
                setSelectedMemory(memory);
                setCurrentMediaIndex(0);
                setIsLoading(true);
                setShowGallery(true);
            }
        }
    }, [memories]);

    const handleNextMedia = useCallback(() => {
        if (selectedMemory) {
            setCurrentMediaIndex((prev) =>
                prev === selectedMemory.media.length - 1 ? 0 : prev + 1
            );
            setIsLoading(true);
        }
    }, [selectedMemory]);

    const handlePrevMedia = useCallback(() => {
        if (selectedMemory) {
            setCurrentMediaIndex((prev) =>
                prev === 0 ? selectedMemory.media.length - 1 : prev - 1
            );
            setIsLoading(true);
        }
    }, [selectedMemory]);

    const handleMediaLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    const handleBackToNotes = useCallback(() => {
        setShowGallery(false);
    }, []);

    if (!isOpen) return null;

    if (memoriesLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                </div>
            </div>
        );
    }

    if (memoriesError) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
                                        {/* Main Media */}
                                        <div className="relative flex-1 flex items-center justify-center bg-gray-100 backdrop-blur-md min-h-0">
                                            {isLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                            {selectedMemory.media[currentMediaIndex].type === 'photo' ? (
                                                <img
                                                    src={selectedMemory.media[currentMediaIndex].url}
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
                                                    <source src={selectedMemory.media[currentMediaIndex].url} type="video/mp4" />
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
                                                                    src={thumbnails[media.url]}
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