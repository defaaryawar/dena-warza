import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Star } from 'lucide-react';
import StoryCard from './StorySection/StoryCard';
import Modal from './StorySection/Modal';
import { useIsMobile } from '../hooks/isMobile';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView'; // Import hook useInView

interface Story {
    icon: React.ReactNode;
    title: string;
    date: string;
    description: string;
    fullStory: string;
    color: string;
    hoverColor: string;
}

const StorySection: React.FC = () => {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const isMobile = useIsMobile();

    // Gunakan useInView untuk teks "Cerita Cinta Kami"
    const { setRef: setTitleRef, inView: titleInView } = useInView(0.5);

    // Gunakan useInView untuk teks deskripsi
    const { setRef: setDescRef, inView: descInView } = useInView(0.5);

    useEffect(() => {
        document.body.style.overflow = selectedStory ? 'hidden' : 'unset';
    }, [selectedStory]);

    const storyData: Story[] = [
        {
            icon: <BookOpen className="text-purple-500" size={24} />,
            title: "Awal Pertemuan",
            date: "2019",
            description: "Dua orang asing yang tertutup",
            fullStory: "Awalnya, Defano dan Najmita sama-sama cuek...",
            color: "bg-gradient-to-br from-purple-100 to-purple-200",
            hoverColor: "hover:from-purple-200 hover:to-purple-300"
        },
        {
            icon: <Star className="text-yellow-500" size={24} />,
            title: "Perjalanan Cinta",
            date: "27 September 2024",
            description: "Gimana dua orang beda banget bisa jadian?",
            fullStory: "Lima tahun berlalu, dan boom!...",
            color: "bg-gradient-to-br from-yellow-100 to-yellow-200",
            hoverColor: "hover:from-yellow-200 hover:to-yellow-300"
        },
        {
            icon: <Heart className="text-red-500" size={24} />,
            title: "Cinta Kami",
            date: "Sekarang",
            description: "Defano & Najmita: Dua Dunia Berbeda",
            fullStory: "Defano masih sosok yang tertutup...",
            color: "bg-gradient-to-br from-red-100 to-red-200",
            hoverColor: "hover:from-red-200 hover:to-red-300"
        }
    ];

    return (
        <section className="bg-white">
            <div className="container mx-auto px-4">
                {/* Animasi untuk teks "Cerita Cinta Kami" */}
                <motion.h2
                    ref={setTitleRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-4xl font-extrabold text-center mb-4 text-gray-900"
                >
                    Cerita Cinta Kami
                </motion.h2>

                {/* Animasi untuk teks deskripsi */}
                <motion.p
                    ref={setDescRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={descInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
                >
                    Perjalanan cinta Defano dan Najmita, dari awal pertemuan hingga saat ini.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {storyData.map((story, index) => (
                        <StoryCard
                            key={index}
                            story={story}
                            index={index}
                            setSelectedStory={setSelectedStory}
                        />
                    ))}
                </div>
            </div>

            {selectedStory && <Modal story={selectedStory} onClose={() => setSelectedStory(null)} />}
        </section>
    );
};

export default StorySection;