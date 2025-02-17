
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Edit } from 'lucide-react'; // Tambahkan ikon Edit
import { EditMemoryModal } from '../components/EditMemoryPage/EditMemoryModal';
import { MemoryCard } from '../components/ui/MemoryCard';
import CustomAlert from '../components/ui/CustomAlert';
import type { Memory } from '../types/Memory';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const EditMemoryPage: React.FC = () => {
    // State untuk memories dan loading
    const [memories, setMemories] = useState<Memory[]>([]);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State untuk modal dan alert
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // State untuk form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Fetch semua memories
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

    // Fetch memory berdasarkan ID
    const fetchMemoryById = useCallback(async (memoryId: string) => {
        console.log('Mencoba fetch memory dengan ID:', memoryId); // Log ID yang dikirim
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/api/memories/${memoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                console.log('Gagal fetch memory:', memoryId); // Log jika gagal
                throw new Error('Memory not found');
            }
            const data = await response.json();

            setSelectedMemory(data);
            setTitle(data.title);
            setDescription(data.description || '');
            setDate(new Date(data.date).toISOString().split('T')[0]);
            setTags(data.tags || []);
            setPreviewUrls(data.media?.map((m: { url: string }) => m.url) || []);
            setIsModalOpen(true);
            console.log('Modal seharusnya terbuka dengan isModalOpen:', true); // Cek nilai isModalOpen
            // Pastikan modal dibuka setelah data ditemukan
            console.log('Modal dibuka dengan data:', data); // Log saat modal dibuka
        } catch (err) {
            console.error('Terjadi kesalahan:', err); // Log jika terjadi error
            setError('Failed to fetch memory');
        }
    }, []);

    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);

        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    // Handle hapus media
    const handleRemoveMedia = (index: number) => {
        if (previewUrls.length === 1) {
            setError('Minimal harus ada satu media');
            return;
        }
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle tambah tag
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags(prev => [...prev, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    // Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
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
            formData.append('title', title);
            formData.append('description', description || '');
            formData.append('date', date);
            formData.append('tags', JSON.stringify(tags));

            files.forEach(file => formData.append('media', file));

            const existingMedia = selectedMemory.media
                .filter((media, index) => previewUrls.includes(media.url))
                .map(media => ({
                    id: media.id,
                    type: media.type,
                    url: media.url
                }));
            formData.append('existingMedia', JSON.stringify(existingMedia));

            const response = await fetch(`${API_URL}/api/memories/${selectedMemory.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Update gagal');
            }

            setShowAlert({ type: 'success', message: 'Memory berhasil diperbarui!' });
            setTimeout(() => {
                setShowAlert(null);
                setIsModalOpen(false);
                fetchMemories();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            setShowAlert({ type: 'error', message: 'Gagal memperbarui memory' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {showAlert && (
                <div className="fixed top-4 right-4 z-50">
                    <CustomAlert
                        type={showAlert.type}
                        message={showAlert.message}
                        onClose={() => setShowAlert(null)}
                    />
                </div>
            )}

            <div className="mb-8 space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Daftar Kenangan
                </h1>
                <p className="text-gray-600">
                    Koleksi momen berharga yang telah Anda abadikan
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {memories.map(memory => (
                        <div key={memory.id} className="relative group">
                            <MemoryCard
                                memory={memory}
                                onClick={() => {
                                    console.log('MemoryCard diklik, ID:', memory.id); // Log ketika card diklik
                                    fetchMemoryById(memory.id);
                                }}
                            />
                            {/* Tambahkan tombol edit dengan ikon pensil */}
                            <button
                                onClick={() => fetchMemoryById(memory.id)}
                                className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-all shadow-sm"
                            >
                                <Edit className="w-5 h-5 text-purple-600" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <EditMemoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
    );
};

export default EditMemoryPage;