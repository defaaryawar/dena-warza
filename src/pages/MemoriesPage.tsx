import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemoryGalleryAll from '../components/MemoryGalleryAll';

const MemoriesPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="container mx-auto px-10 py-4 flex justify-between items-center">
                    {/* Back Button */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-700 hover:text-gray-900 
                        transition-colors duration-300 
                        bg-gray-100 hover:bg-gray-200 
                        px-4 py-2 rounded-sm cursor-pointer"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="ml-2 hidden sm:inline">Back</span>
                    </button>

                    {/* Page Title */}
                    <h1 className="text-xl font-semibold text-gray-800 text-center flex-grow">
                        My Memories
                    </h1>

                    {/* Placeholder for alignment */}
                    <div className="w-10"></div>
                </div>
            </div>

            {/* Memories Gallery */}
            <div className="container mx-auto px-4 py-6">
                <MemoryGalleryAll />
            </div>
        </div>
    );
};

export default MemoriesPage;