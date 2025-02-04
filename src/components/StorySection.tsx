import React from 'react';
import { Clock } from 'lucide-react';

const StorySection: React.FC = () => (
    <section className="mt-12 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Cerita Selengkapnya
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-blue-500" size={20} />
                        <h3 className="text-xl font-semibold text-gray-800">Kenangan {i}</h3>
                    </div>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                </div>
            ))}
        </div>
    </section>
);

export default StorySection;
