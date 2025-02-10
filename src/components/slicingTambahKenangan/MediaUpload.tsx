import React, { useRef, useState } from 'react';
import { ImagePlus, Video, X, AlertCircle } from 'lucide-react';
import { labelClass, errorClass } from './FormFields';

interface MediaUploadProps {
    files: File[];
    onUpload: (files: File[]) => void;
    onDelete: (index: number) => void;
    error?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ files, onUpload, onDelete, error }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        onUpload(droppedFiles);
    };

    return (
        <div className="space-y-3">
            <label className={labelClass}>
                <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <Video className="w-4 h-4" />
                    <span>Media Kenangan</span>
                </div>
            </label>
            
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                    relative rounded-lg border-2 border-dashed p-8
                    ${isDragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-300' : 'border-gray-200'}
                    transition-all duration-200 cursor-pointer
                    hover:bg-gray-50
                `}
            >
                <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && onUpload(Array.from(e.target.files))}
                    className="hidden"
                />
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Klik atau seret file ke sini
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Maks. 10 file (Foto/Video)
                    </p>
                </div>
            </div>

            {error && (
                <p className={errorClass}>
                    <AlertCircle className="w-4 h-4" /> {error}
                </p>
            )}

            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {files.map((file, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden">
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover"
                                />
                            ) : (
                                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                                    <Video className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(index);
                                    }}
                                    className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};