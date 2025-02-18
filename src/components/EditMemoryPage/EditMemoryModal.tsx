import React, { FormEvent } from 'react';
import { X, Loader2, AlertCircle, Camera, Upload, Tag, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import { motion, AnimatePresence } from 'framer-motion';
import type { Memory } from '../../types/Memory';

interface EditMemoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    memory: Memory | null;
    loading: boolean;
    error: string | null;
    onSubmit: (e: FormEvent) => Promise<void>;
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
    if (!memory) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.3,
                            type: "spring",
                            bounce: 0.3
                        }}
                        className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl"
                    >
                        <form onSubmit={handleSubmit} className="h-full flex flex-col">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center justify-between p-4 border-b"
                            >
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Edit Kenangan
                                </h2>
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </motion.button>
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 p-4 overflow-auto">
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <p>{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Left Column */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Judul</label>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Masukkan judul kenangan"
                                                required
                                                className="mt-1 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                            />
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Ceritakan kenangan Anda..."
                                                className="mt-1 h-28 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                            />
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-purple-500"/>
                                                Tanggal
                                            </label>
                                            <Input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                className="mt-1 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                            />
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.01 }} className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-purple-500" />
                                                Tag
                                            </label>
                                            <motion.div layout className="mt-1 flex flex-wrap gap-1.5 min-h-[36px] p-1.5 bg-gray-50 rounded-lg">
                                                <AnimatePresence>
                                                    {tags.map(tag => (
                                                        <motion.span
                                                            key={tag}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center"
                                                        >
                                                            {tag}
                                                            <motion.button
                                                                type="button"
                                                                onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="ml-1.5 text-purple-500 hover:text-purple-700"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </motion.button>
                                                        </motion.span>
                                                    ))}
                                                </AnimatePresence>
                                            </motion.div>
                                            <Input
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                placeholder="Tambah tag dan tekan Enter"
                                                className="mt-2 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Right Column */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-purple-500" />
                                                Media
                                            </label>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="mt-1 border-2 border-dashed border-purple-200 rounded-lg p-4 bg-purple-50/50 hover:bg-purple-50 transition-colors"
                                            >
                                                <label className="cursor-pointer flex flex-col items-center gap-2">
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            ease: "easeInOut"
                                                        }}
                                                    >
                                                        <Upload className="w-8 h-8 text-purple-400" />
                                                    </motion.div>
                                                    <span className="text-xs text-purple-600 font-medium">
                                                        Klik untuk memilih foto atau video
                                                    </span>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*,video/*"
                                                        multiple
                                                        className="hidden"
                                                    />
                                                </label>
                                            </motion.div>

                                            <motion.div layout className="mt-2 grid grid-cols-3 gap-2">
                                                <AnimatePresence>
                                                    {previewUrls.map((url, index) => (
                                                        <motion.div
                                                            key={url}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            whileHover={{ scale: 1.05 }}
                                                            className="relative group"
                                                        >
                                                            <img
                                                                src={url}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-lg ring-1 ring-purple-100"
                                                            />
                                                            <motion.button
                                                                type="button"
                                                                onClick={() => handleRemoveMedia(index)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-4 border-t flex justify-end gap-3"
                            >
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="text-sm hover:bg-purple-50 cursor-pointer"
                                    >
                                        Batal
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="text-sm bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Menyimpan...
                                            </div>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};