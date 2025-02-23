import { AlertCircle, Calendar } from 'lucide-react';
import { FormFieldProps } from '../../types/types';
import { motion } from 'framer-motion';

// Shared styles
export const labelClass = "flex items-center gap-2 text-gray-700 font-medium mb-2";
export const inputClass = "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-700 placeholder-gray-400";
export const errorClass = "flex items-center gap-1.5 text-red-500 text-sm mt-1.5";

// Animation variants
const inputVariants = {
    focus: {
        scale: 1.02,
        boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.2)",
        transition: { duration: 0.2 }
    },
    hover: {
        scale: 1.01,
        boxShadow: "0 4px 6px -1px rgba(168, 85, 247, 0.1), 0 2px 4px -1px rgba(168, 85, 247, 0.06)",
        transition: { duration: 0.2 }
    }
};

// Form Fields Components
export const TitleField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>Judul Kenangan</label>
        <motion.input
            type="text"
            name="title"
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                clearError?.();
            }}
            className={`${inputClass} ${error ? 'border-red-300' : 'border-gray-200'}`}
            placeholder="Mis: Hari yang indah di pantai..."
            maxLength={100}
            required
            whileHover="hover"
            whileFocus="focus"
            variants={inputVariants}
        />
        {error && (
            <motion.p
                className={errorClass}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <AlertCircle className="w-4 h-4" /> {error}
            </motion.p>
        )}
    </div>
);

export const DescriptionField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>Deskripsi Kenangan</label>
        <div className="relative">
            <motion.textarea
                name="description"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    clearError?.();
                }}
                className={`${inputClass} h-32 resize-none ${error ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Ceritakan momen spesialmu..."
                maxLength={500}
                required
                whileHover="hover"
                whileFocus="focus"
                variants={inputVariants}
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                {value.length}/500
            </span>
        </div>
        {error && (
            <motion.p
                className={errorClass}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <AlertCircle className="w-4 h-4" /> {error}
            </motion.p>
        )}
    </div>
);

export const DateField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>
            <Calendar className="w-4 h-4 text-purple-500" />
            Tanggal Kenangan
        </label>
        <motion.input
            type="date"
            name="date"
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                clearError?.();
            }}
            className={`${inputClass} ${error ? 'border-red-300' : 'border-gray-200'}`}
            max={new Date().toISOString().split('T')[0]}
            required
            whileHover="hover"
            whileFocus="focus"
            variants={inputVariants}
        />
        {error && (
            <motion.p
                className={errorClass}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <AlertCircle className="w-4 h-4" /> {error}
            </motion.p>
        )}
    </div>
);