import React from 'react';

interface TextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    value,
    onChange,
    placeholder,
    required = false,
    className = ''
}) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    />
);