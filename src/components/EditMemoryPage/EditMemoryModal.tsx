// EditMemoryModal.tsx
import React from 'react';
import { X, Loader2, AlertCircle, Camera, Upload, Tag, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import type { Memory } from '../../types/Memory';

interface EditMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    memory: Memory | null;
    loading: boolean;
    error: string | null;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    tagInput: string;
    setTagInput: (value: string) => void;
    previewUrls: string[];
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveMedia: (index: number) => void;
    handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
    isOpen,
    onClose,
    memory,
    loading,
    error,
    onSubmit,
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    tags,
    setTags,
    tagInput,
    setTagInput,
    previewUrls,
    handleFileChange,
    handleRemoveMedia,
    handleAddTag,
}) => {
    if (!isOpen || !memory) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl transform transition-all">
                    <div className="max-h-[90vh] overflow-y-auto">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Edit Kenangan
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-shake">
                                    <AlertCircle className="h-5 w-5" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Judul</label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Masukkan judul kenangan"
                                                required
                                                className="focus:ring-purple-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Ceritakan kenangan Anda..."
                                                className="min-h-[150px] focus:ring-purple-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-purple-500" />
                                                Tanggal
                                            </label>
                                            <Input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                className="focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-purple-500" />
                                                Tag
                                            </label>
                                            <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 rounded-lg">
                                                {tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center animate-fadeIn"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => setTags((prev: string[]) => prev.filter((t: string) => t !== tag))}
                                                            className="ml-2 text-purple-500 hover:text-purple-700"
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
                                                className="focus:ring-purple-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-purple-500" />
                                                Media
                                            </label>
                                            <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-purple-50/50 transition-colors hover:bg-purple-50">
                                                <div className="flex items-center justify-center">
                                                    <label className="cursor-pointer">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <Upload className="w-10 h-10 text-purple-400" />
                                                            <span className="text-sm text-purple-600 font-medium">
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

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative group animate-fadeIn">
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg ring-2 ring-purple-100"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMedia(index)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-6 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        className="hover:bg-purple-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};