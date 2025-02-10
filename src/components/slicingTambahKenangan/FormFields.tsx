import { AlertCircle, Calendar,} from 'lucide-react';
import { FormFieldProps } from '../../types/types';

// Shared styles
export const labelClass = "flex items-center gap-2 text-gray-700 font-medium mb-2";
export const inputClass = "w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700";
export const errorClass = "flex items-center gap-1.5 text-red-500 text-sm mt-1.5";

// Form Fields Components
export const TitleField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>Judul Kenangan</label>
        <input
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
        />
        {error && (
            <p className={errorClass}>
                <AlertCircle className="w-4 h-4" /> {error}
            </p>
        )}
    </div>
);

export const DescriptionField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>Deskripsi Kenangan</label>
        <div className="relative">
            <textarea
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
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                {value.length}/500
            </span>
        </div>
        {error && (
            <p className={errorClass}>
                <AlertCircle className="w-4 h-4" /> {error}
            </p>
        )}
    </div>
);

export const DateField: React.FC<FormFieldProps> = ({ value, onChange, error, clearError }) => (
    <div className="space-y-1">
        <label className={labelClass}>
            <Calendar className="w-4 h-4" />
            Tanggal Kenangan
        </label>
        <input
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
        />
        {error && (
            <p className={errorClass}>
                <AlertCircle className="w-4 h-4" /> {error}
            </p>
        )}
    </div>
);