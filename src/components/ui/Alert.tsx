import React from 'react';

export interface AlertProps {
    children: React.ReactNode;
    className?: string;
}

export interface AlertDescriptionProps {
    children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-4 rounded-lg bg-white shadow-md ${className}`}>
            {children}
        </div>
    );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
    return (
        <div className="text-gray-700">
            {children}
        </div>
    );
};

export const AlertTitle: React.FC<AlertProps> = ({ children, className = '' }) => {
    return (
        <div className={`text-lg font-semibold mb-2 ${className}`}>
            {children}
        </div>
    );
};

export default Alert;