import React from 'react';

interface InputProps {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    type = 'text',
    value,
    onChange,
    onKeyDown,
    placeholder,
    required = false,
    className = ''
}) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    />
);