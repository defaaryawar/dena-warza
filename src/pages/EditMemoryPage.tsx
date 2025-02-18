import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Loader2, Edit, ArrowLeftIcon, Search, Clock, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { EditMemoryModal } from '../components/EditMemoryPage/EditMemoryModal';
import { MemoryCard } from '../components/ui/MemoryCard';
import CustomAlert from '../components/ui/CustomAlert';
import type { Memory } from '../types/Memory';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { AlertDescription } from '../components/ui/Alert';
import { useIsMobile } from '../hooks/isMobile';

const API_URL = import.meta.env.VITE_API_BASE_URL;

type SortOption = 'newest' | 'oldest' | 'mostTags' | 'leastTags';

export const EditMemoryPage: React.FC = () => {
    const isMobile = useIsMobile()
    const [memories, setMemories] = useState<Memory[]>([]);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isTagsMenuOpen, setIsTagsMenuOpen] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        const filtered = memories.filter(memory =>
            memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memory.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredMemories(filtered);
    }, [searchQuery, memories]);

    useEffect(() => {
        const tags = new Set<string>();
        memories.forEach(memory => {
            memory.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));
    }, [memories]);

    useEffect(() => {
        let result = [...memories];

        // Apply search filter
        if (searchQuery) {
            result = result.filter(memory =>
                memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                memory.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply tag filters
        if (selectedTags.length > 0) {
            result = result.filter(memory =>
                selectedTags.every(tag => memory.tags?.includes(tag))
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            case 'mostTags':
                result.sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
                break;
            case 'leastTags':
                result.sort((a, b) => (a.tags?.length || 0) - (b.tags?.length || 0));
                break;
        }

        setFilteredMemories(result);
    }, [memories, searchQuery, sortBy, selectedTags]);

    const fetchMemories = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/memories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch memories');
            const data = await response.json();
            setMemories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load memories');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMemoryById = useCallback(async (memoryId: string) => {
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/api/memories/${memoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Memory not found');
            const data = await response.json();

            setSelectedMemory(data);
            setTitle(data.title);
            setDescription(data.description || '');
            setDate(new Date(data.date).toISOString().split('T')[0]);
            setTags(data.tags || []);
            setPreviewUrls(data.media?.map((m: { url: string }) => m.url) || []);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to fetch memory');
        }
    }, []);

    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);

        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const handleRemoveMedia = (index: number) => {
        if (previewUrls.length === 1) {
            setError('Minimal harus ada satu media');
            return;
        }
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags(prev => [...prev, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!title.trim()) {
            setError('Judul harus diisi');
            setSaving(false);
            return;
        }

        const token = sessionStorage.getItem('authToken');
        if (!token || !selectedMemory) {
            setError('Authentication required');
            setSaving(false);
            return;
        }

        try {
            const formData = new FormData();

            // Prepare update data
            const updateData: Record<string, any> = {};

            // Track changed fields
            if (title !== selectedMemory.title) {
                updateData.title = title;
            }
            if (description !== selectedMemory.description) {
                updateData.description = description;
            }
            if (date !== new Date(selectedMemory.date).toISOString().split('T')[0]) {
                updateData.date = date;
            }
            if (JSON.stringify(tags) !== JSON.stringify(selectedMemory.tags)) {
                updateData.tags = tags;
            }

            // Handle media changes
            if (selectedMemory.media && Array.isArray(selectedMemory.media)) {

                const removedMedia = selectedMemory.media
                    .filter(media => !previewUrls.includes(media.url))
                    .map(media => media.id);

                if (removedMedia.length > 0) {
                    updateData.mediaToDelete = removedMedia;
                }

                // Add existing media that should be kept
                const existingMedia = selectedMemory.media
                    .filter(media => previewUrls.includes(media.url))
                    .map(media => ({
                        id: media.id,
                        type: media.type,
                        url: media.url
                    }));

                if (existingMedia.length > 0) {
                    updateData.existingMedia = existingMedia;
                }
            }

            // Add new files
            files.forEach((file) => {
                formData.append('files', file);
            });

            // Append the update data
            formData.append('data', JSON.stringify(updateData));

            const response = await fetch(`${API_URL}/api/memories/${selectedMemory.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Update gagal');
            }

            setShowAlert({ type: 'success', message: 'Memory berhasil diperbarui!' });

            setTimeout(() => {
                setShowAlert(null);
                setIsModalOpen(false);
                fetchMemories();
            }, 2000);
        } catch (err) {
            console.error('❌ Error during submission:', err);
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setShowAlert({ type: 'error', message: 'Gagal memperbarui memory' });
        } finally {
            setSaving(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMemory(null);
        setTitle('');
        setDescription('');
        setDate('');
        setTags([]);
        setTagInput('');
        setFiles([]);
        setPreviewUrls([]);
    };

    const backToHome = () => {
        navigate('/')
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50"
        >
            {/* Modern Header */}
            <header className="shadow-sm sticky -top-0.5 z-40 backdrop-blur-sm bg-white/90">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col py-4 space-y-4">
                        {/* Guidelines Alert */}
                        <AnimatePresence>
                            {showGuidelines && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className='p-1.5'>
                                        <div className="p-4 rounded-lg bg-white shadow-md shadow-red-600 overflow-hidden">
                                            <div className='justify-between flex relative items-center'>
                                                <div>
                                                    {/* <Heart className="w-4 h-4 text-purple-500" /> */}
                                                    <AlertDescription>
                                                        <p className="font-medium mb-2 md:text-lg text-sm">Sayang, sebelum mengedit kenangan kita, mohon perhatikan hal berikut ya:</p>
                                                        <ul className="list-disc pl-5 space-y-1 md:text-sm text-xs">
                                                            <li>Setiap kenangan adalah momen berharga yang tak tergantikan</li>
                                                            <li>Pastikan perubahan yang dibuat mempertahankan esensi dari momen tersebut</li>
                                                            <li>Jangan menghapus detail penting yang mungkin berarti di masa depan</li>
                                                            <li>Tambahkan tag yang sesuai untuk memudahkan pencarian kenangan kita</li>
                                                        </ul>
                                                        <button
                                                            onClick={() => setShowGuidelines(false)}
                                                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                                                        >
                                                            Mengerti, jangan tampilkan lagi
                                                        </button>
                                                    </AlertDescription>
                                                </div>
                                                <AlertTriangle className='absolute md:right-10 right-0 -bottom-0 md:bottom-8.5 md:w-24 md:h-24 w-8 h-8 text-red-600' />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Top Row */}
                        <div className="flex items-center justify-between">
                            <motion.button
                                whileHover={!isMobile ? { scale: 1.02 } : undefined}
                                whileTap={{ scale: 0.98 }}
                                onClick={backToHome}
                                className="flex items-center space-x-2 text-purple-600 px-4 py-2 rounded-lg md:hover:bg-purple-50 transition-all cursor-pointer"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                <span className='md:block hidden'>Kembali</span>
                            </motion.button>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari kenangan..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent md:w-96 w-full transition-all duration-300 md:hover:shadow-sm cursor-pointer"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Bottom Row - Filters */}
                        <div className="flex items-center justify-center space-x-4">
                            <motion.div className="flex space-x-2">
                                <motion.button
                                    whileHover={!isMobile ? { scale: 1.05 } : undefined}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSortBy('newest')}
                                    className={`flex items-center px-3 py-1 rounded-full transition-all cursor-pointer ${sortBy === 'newest'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-600 md:hover:bg-gray-200'
                                        }`}
                                >
                                    <Clock className="w-4 h-4 mr-1" />
                                    Terbaru
                                </motion.button>
                                <motion.button
                                    whileHover={!isMobile ? { scale: 1.05 } : undefined}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSortBy('oldest')}
                                    className={`flex items-center px-3 py-1 rounded-full transition-all cursor-pointer ${sortBy === 'oldest'
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-600 md:hover:bg-gray-200'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Terlama
                                </motion.button>
                            </motion.div>

                            {/* Tags Filter */}
                            <div className="relative">
                                <motion.button
                                    whileHover={!isMobile ? { scale: 1.05 } : undefined}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsTagsMenuOpen(!isTagsMenuOpen)}
                                    className="flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 md:hover:bg-gray-200 transition-all cursor-pointer"
                                >
                                    <Tag className="w-4 h-4 mr-1" />
                                    Filter Tags
                                </motion.button>

                                <AnimatePresence>
                                    {isTagsMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-4 w-64 max-h-64 overflow-y-auto"
                                        >
                                            <div className="space-y-2">
                                                {allTags.map(tag => (
                                                    <motion.div
                                                        key={tag}
                                                        whileHover={!isMobile ? { scale: 1.02 } : undefined}
                                                        className="flex items-center"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={tag}
                                                            checked={selectedTags.includes(tag)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedTags([...selectedTags, tag]);
                                                                } else {
                                                                    setSelectedTags(selectedTags.filter(t => t !== tag));
                                                                }
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={tag}>{tag}</label>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <AnimatePresence>
                    {showAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-4 right-4 z-50"
                        >
                            <CustomAlert
                                type={showAlert.type}
                                message={showAlert.message}
                                onClose={() => setShowAlert(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center space-y-4"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                        Daftar Kenangan
                    </h1>
                    <p className="text-gray-600">
                        Koleksi momen berharga yang telah Anda abadikan
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="w-8 h-8 text-purple-500" />
                        </motion.div>
                    </div>
                ) : (
                    <LayoutGroup>
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredMemories.map((memory, _index) => (
                                    <motion.div
                                        layout
                                        key={memory.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{
                                            opacity: { duration: 0.3 },
                                            scale: { duration: 0.5 },
                                            layout: { duration: 0.3 }
                                        }}
                                        className="relative group"
                                        whileHover={!isMobile ? { y: -5 } : undefined}
                                    >
                                        <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 md:group-hover:shadow-lg">
                                            <MemoryCard
                                                memory={memory}
                                                onClick={() => {
                                                    console.log("Card clicked", memory.id); // Debugging
                                                    fetchMemoryById(memory.id);
                                                }}
                                            />  
                                            <motion.button
                                                whileHover={!isMobile ? { scale: 1.1 } : undefined}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fetchMemoryById(memory.id);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full md:hover:bg-white transition-all shadow-sm opacity-0 md:group-hover:opacity-100 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5 text-purple-600" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </LayoutGroup>
                )}

                <EditMemoryModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    memory={selectedMemory}
                    loading={saving}
                    error={error}
                    onSubmit={handleSubmit}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    date={date}
                    setDate={setDate}
                    tags={tags}
                    setTags={setTags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    previewUrls={previewUrls}
                    handleFileChange={handleFileChange}
                    handleRemoveMedia={handleRemoveMedia}
                    handleAddTag={handleAddTag}
                />
            </div>
        </motion.div>
    );
};

export default EditMemoryPage;