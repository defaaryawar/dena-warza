import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { inputClass, labelClass } from './FormFields';

interface TagInputProps {
    tags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
            onAddTag(trimmedTag);
            setNewTag('');
        }
    };

    return (
        <div className="space-y-3">
            <label className={labelClass}>
                <Tag className="w-4 h-4" />
                Label Kenangan
            </label>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className={`${inputClass} border-gray-200`}
                    placeholder="Tambah label dan tekan Enter..."
                    maxLength={20}
                    disabled={tags.length >= 5}
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={tags.length >= 5}
                    className={`
                        px-4 rounded-lg font-medium transition-all
                        ${tags.length >= 5
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }
                    `}
                >
                    Tambah
                </button>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                    bg-blue-50 text-blue-700 text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => onRemoveTag(tag)}
                                className="hover:text-blue-900"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-400">
                {tags.length}/5 label digunakan
            </p>
        </div>
    );
};