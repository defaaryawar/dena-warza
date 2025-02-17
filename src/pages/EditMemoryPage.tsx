import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, AlertCircle, Camera, Upload, Tag, Calendar } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Memory {
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    media: MediaItem[];
}

interface MediaItem {
    id: string;
    type: 'photo' | 'video';
    url: string;
}

// Custom Button Component
const Button = ({
    children,
    variant = 'default',
    type = 'button',
    disabled = false,
    className = '',
    onClick
}: {
    children: React.ReactNode;
    variant?: 'default' | 'outline';
    type?: 'button' | 'submit';
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 hover:bg-gray-50"
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// Custom Input Component
const Input = ({
    type = 'text',
    value,
    onChange,
    onKeyDown,
    placeholder,
    required = false,
    className = ''
}: {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
);

// Custom Textarea Component
const Textarea = ({
    value,
    onChange,
    placeholder,
    required = false,
    className = ''
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
);

// Custom Card Component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
        {children}
    </div>
);

const EditMemoryPage = () => {
    const navigate = useNavigate();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(''); // Default to empty string
    const [tags, setTags] = useState<string[]>([]); // Initialize as empty array
    const [tagInput, setTagInput] = useState('');

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
            console.log({ data })
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

            // Kirim tags sebagai JSON string
            formData.append('tags', JSON.stringify(tags));

            // Kirim file baru sebagai media
            files.forEach(file => formData.append('media', file));

            // Kirim media yang sudah ada dengan struktur yang benar
            const existingMedia = selectedMemory.media.map(media => ({
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

            navigate('/memories');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Memory Selection Card */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Pilih Kenangan
                        </h2>
                        {memories.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">
                                Tidak ada kenangan tersedia
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {memories.map(memory => (
                                    <Button
                                        key={memory.id}
                                        variant={selectedMemory?.id === memory.id ? "default" : "outline"}
                                        className="w-full text-left"
                                        onClick={() => fetchMemoryById(memory.id)}
                                    >
                                        {memory.title}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Edit Form Card */}
                {selectedMemory && (
                    <Card>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Edit Kenangan
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Judul</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Masukkan judul kenangan"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Deskripsi</label>
                                    <Textarea
                                        value={description || ''} // Pastikan tidak ada nilai null
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ceritakan kenangan Anda..."
                                        className="min-h-[100px]"
                                        required={false} // Sesuaikan dengan validasi backend
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Tanggal
                                    </label>
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Tag
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Tambah tag dan tekan Enter"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        Media
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div className="flex items-center justify-center">
                                            <label className="cursor-pointer">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="w-8 h-8 text-gray-400" />
                                                    <span className="text-sm text-gray-500">
                                                        Klik untuk memilih foto atau video
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept="image/*,video/*"
                                                    multiple
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedia(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {saving ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            'Simpan'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default EditMemoryPage;