import React from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MemoryGalleryAll from '../components/MemoryGalleryAll';

const MemoriesPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Back Button */}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 
                        transition-all duration-300 ease-in-out
                        bg-gray-100 hover:bg-gray-200 
                        px-4 py-2 rounded-lg shadow-sm hover:shadow
                        focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium cursor-pointer">Back</span>
                    </button>

                    {/* Page Title with Icon */}
                    <div className="flex items-center gap-2 flex-grow justify-center">
                        <Camera className="w-6 h-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            My Memories
                        </h1>
                    </div>

                    {/* Placeholder for alignment */}
                    <div className="w-12"></div>
                </div>
            </div>

            {/* Page Content */}
            <main className="container mx-auto px-0 py-8">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore your cherished moments and beautiful memories captured over time.
                    </p>
                </div>

                {/* Memory Gallery Section */}
                <div className="bg-white shadow-sm border border-gray-100 p-6">
                    <MemoryGalleryAll />
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
                    Cherish every moment, capture beautiful memories
                </div>
            </footer>
        </div>
    );
};

export default MemoriesPage;