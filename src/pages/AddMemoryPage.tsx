import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Save, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
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

    const clearError = (field: keyof MemoryFormErrors) => {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

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

            toast.success('Kenangan berhasil disimpan!');
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

    const handleBackToHome = () => {
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackToHome}
                                className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-600" />
                                <h1 className="text-lg font-semibold text-gray-800 md:block hidden">
                                    Tambah Kenangan Baru
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer border border-gray-400 md:hover:bg-gray-100 transition-all duration-300 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="memory-form"
                                disabled={isSubmitting}
                                className={`
                                    inline-flex items-center px-4 py-1.5 text-sm font-medium text-white
                                    bg-blue-600 rounded-md cursor-pointer md:hover:bg-blue-700 transition-all duration-300 border border-blue-500 md:hover:border-blue-600
                                    ${isSubmitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-700'}
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
                                        <span>Simpan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Alerts */}
                {(alert || errors.server) && (
                    <div className="mb-6">
                        {alert && (
                            <CustomAlert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                                className="mb-3 last:mb-0"
                            />
                        )}
                        {errors.server && (
                            <CustomAlert
                                type="error"
                                message={errors.server}
                                onClose={() => clearError('server')}
                                className="mb-3 last:mb-0"
                            />
                        )}
                    </div>
                )}

                {/* Two Column Layout */}
                <form id="memory-form" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Basic Information */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h2 className="text-sm font-medium text-gray-700">Informasi Dasar</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                <TitleField
                                    value={title}
                                    onChange={setTitle}
                                    error={errors.title}
                                    clearError={() => clearError('title')}
                                />
                                <DateField
                                    value={date}
                                    onChange={setDate}
                                    error={errors.date}
                                    clearError={() => clearError('date')}
                                />
                                <DescriptionField
                                    value={description}
                                    onChange={setDescription}
                                    error={errors.description}
                                    clearError={() => clearError('description')}
                                />
                                <TagInput
                                    tags={tags}
                                    onAddTag={(tag) => setTags(prev => [...prev, tag].slice(0, 5))}
                                    onRemoveTag={(tag) => setTags(prev => prev.filter(t => t !== tag))}
                                />
                            </div>
                        </div>

                        {/* Right Column - Media Upload */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h2 className="text-sm font-medium text-gray-700">Media</h2>
                            </div>
                            <div className="p-4">
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
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahKenangan;