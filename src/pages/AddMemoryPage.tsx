import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Save, ChevronLeft, Calendar, Hash, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { TitleField, DescriptionField, DateField } from '../components/slicingTambahKenangan/FormFields';
import { MediaUpload } from '../components/slicingTambahKenangan/MediaUpload';
import { TagInput } from '../components/slicingTambahKenangan/TagInput';
import { validations } from '../components/utils/validations';
import { MemoryFormErrors } from '../types/types';
import CustomAlert from '../components/ui/CustomAlert';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const TambahKenangan: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<MemoryFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    // Clear error for a specific field
    const clearError = (field: keyof MemoryFormErrors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    // Handle media file upload
    const handleMediaUpload = useCallback((newFiles: File[]) => {
        const validFiles = newFiles.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
            const maxSize = 50 * 1024 * 1024; // 50MB

            if (!validTypes.includes(file.type)) {
                toast.error(`Tipe berkas tidak valid: ${file.name}`);
                return false;
            }

            if (file.size > maxSize) {
                toast.error(`Ukuran berkas terlalu besar: ${file.name}`);
                return false;
            }

            return true;
        });

        setMediaFiles(prev => [...prev, ...validFiles].slice(0, 10));
    }, []);

    // Validate form fields
    const validateForm = useCallback((): boolean => {
        const newErrors: MemoryFormErrors = {};

        const titleError = validations.validateTitle(title);
        if (titleError) newErrors.title = titleError;

        const descriptionError = validations.validateDescription(description);
        if (descriptionError) newErrors.description = descriptionError;

        const dateError = validations.validateDate(date);
        if (dateError) newErrors.date = dateError;

        if (mediaFiles.length === 0) {
            newErrors.media = 'Minimal unggah 1 foto/video';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [title, description, date, mediaFiles]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstErrorKey = Object.keys(errors)[0] as keyof MemoryFormErrors;
            const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
            errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, server: undefined }));

        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                navigate('/login');
                return;
            }

            const formData = new FormData();

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            formData.append('title', title);
            formData.append('description', description);
            formData.append('date', date);

            tags.forEach(tag => {
                formData.append('tags[]', tag);
            });

            const response = await fetch(`${API_URL}/api/memories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    response: {
                        data: data,
                        status: response.status
                    }
                };
            }

            // Show success alert
            setAlert({ type: 'success', message: 'Kenangan berhasil disimpan! 🎉' });
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
        } catch (error: any) {
            console.error('Error submitting:', error);
            setIsSubmitting(false);

            const status = error.response?.status;
            const errorData = error.response?.data;

            if (status === 400) {
                if (errorData?.field === 'title') {
                    setErrors(prev => ({
                        ...prev,
                        title: errorData.error || 'Judul sudah digunakan'
                    }));
                } else if (errorData?.field === 'tags') {
                    toast.error('Format label tidak valid');
                } else {
                    toast.error(errorData?.error || 'Data tidak valid');
                }
            } else if (status === 413) {
                toast.error('Ukuran file terlalu besar');
            } else {
                toast.error('Terjadi kesalahan server');
            }
        }
    };

    // Handle back to home
    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50"
        >
            {/* Top Navigation Bar */}
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-10"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleBackToHome}
                                className="mr-4 p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <h1 className="text-lg font-semibold text-purple-800 md:block hidden">
                                    Tambah Kenangan Baru
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full transition-all duration-300"
                            >
                                Batal
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                form="memory-form"
                                disabled={isSubmitting}
                                className={`
                                    inline-flex items-center px-6 py-2 text-sm font-medium text-white
                                    bg-gradient-to-r from-purple-500 to-pink-500 rounded-full 
                                    hover:from-purple-600 hover:to-pink-600 transition-all duration-300
                                    shadow-lg hover:shadow-xl hover:shadow-purple-200/50
                                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        <span>Simpan Kenangan</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Custom Alert */}
                <AnimatePresence>
                    {alert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6"
                        >
                            <CustomAlert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                                className="mb-3 last:mb-0"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Two Column Layout */}
                <form id="memory-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl shadow-purple-100/20"
                        >
                            <div className="px-6 py-4 border-b border-purple-100">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Informasi Dasar
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-6">
                                    <TitleField
                                        value={title}
                                        onChange={setTitle}
                                        error={errors.title}
                                        clearError={() => clearError('title')}
                                    />
                                    <div className="relative">
                                        <DateField
                                            value={date}
                                            onChange={setDate}
                                            error={errors.date}
                                            clearError={() => clearError('date')}
                                        />
                                    </div>
                                    <DescriptionField
                                        value={description}
                                        onChange={setDescription}
                                        error={errors.description}
                                        clearError={() => clearError('description')}
                                    />
                                    <div className="relative">
                                        <TagInput
                                            tags={tags}
                                            onAddTag={(tag) => setTags(prev => [...prev, tag].slice(0, 5))}
                                            onRemoveTag={(tag) => setTags(prev => prev.filter(t => t !== tag))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Media Upload */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl shadow-purple-100/20"
                        >
                            <div className="px-6 py-4 border-b border-purple-100">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <ImageIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Media Kenangan
                                    </h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <MediaUpload
                                        files={mediaFiles}
                                        onUpload={handleMediaUpload}
                                        onDelete={(index) => {
                                            setMediaFiles(prev => prev.filter((_, i) => i !== index));
                                            if (mediaFiles.length <= 1) {
                                                clearError('media');
                                            }
                                        }}
                                        error={errors.media}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default TambahKenangan;