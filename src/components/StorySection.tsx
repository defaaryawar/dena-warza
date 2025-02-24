import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Star } from 'lucide-react';
import StoryCard from './StorySection/StoryCard';
import Modal from './StorySection/Modal';
import { useIsMobile } from '../hooks/isMobile';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

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
    const { setRef: setTitleRef, inView: titleInView } = useInView(0.5);
    const { setRef: setDescRef, inView: descInView } = useInView(0.5);

    useEffect(() => {
        document.body.style.overflow = selectedStory ? 'hidden' : 'unset';
    }, [selectedStory]);

    const storyData: Story[] = [
        {
            icon: <BookOpen className="text-purple-500" size={24} />,
            title: "Awal Pertemuan di Dunia Maya",
            date: "2019",
            description: "Kisah dua insan yang dipertemukan lewat aplikasi dating dengan alasan berbeda",
            fullStory: "Awalnya di tahun 2019, Defano dan Najmita bertemu di aplikasi dating dengan alasan yang berbeda. Nami yang mencari teman untuk bermain Mobile Legends, sementara Defa yang terpaksa main karena ajakan temannya. Setelah match, mereka sering bermain ML bersama karena kebetulan itu hobi Defa. Namun, mereka sempat lost contact karena kesibukan Defa dengan kekasihnya saat itu. Nami yang sudah merasa cocok dengan Defa merasa kecewa kehilangan teman gamenya. Di 2020, mereka kembali dekat setelah Defa putus dengan kekasihnya. Nami yang selalu mencari info tentang Defa, mencoba mendekati dengan mengajak main game bersama lagi. Hubungan mereka semakin dekat hingga memilih untuk 'berteman' - atau lebih tepatnya HTS. Meski bilang berteman, Defa malah minta nomor dan izin ke orang tua Nami untuk dekat.",
            color: "bg-gradient-to-br from-purple-100 to-purple-200",
            hoverColor: "hover:from-purple-200 hover:to-purple-300"
        },
        {
            icon: <Star className="text-yellow-500" size={24} />,
            title: "Perjalanan Menuju Kepastian",
            date: "27 September 2024",
            description: "Kisah perjuangan cinta yang penuh lika-liku dan pembelajaran berharga",
            fullStory: "Setelah lost contact di awal 2023, mereka menjalani kehidupan masing-masing selama hampir setahun lebih. Defa fokus memperjuangkan cintanya dengan orang lain namun nihil, sementara Nami mencoba membuka hati untuk orang baru. Nami sempat memiliki kekasih di Mei 2024, tapi hubungan itu berakhir di Juli 2024. Setelah melihat Nami memiliki kekasih, Defa merasa ada yang hilang dan menyesal. Begitu tau Nami sudah putus, Defa mulai mendekati lagi lewat reply story WA. Mereka bertemu kembali, dimana Defa menjemput Nami di kantornya. Malam itu menjadi special karena Defa yang biasanya tertutup, justru banyak bercerita. Sejak itu, Defa sangat bersemangat memperjuangkan Nami, selalu ingin bertemu dan komunikasi, bahkan ingin mengenalkan ke orang tua meski baru dekat lagi seminggu.",
            color: "bg-gradient-to-br from-yellow-100 to-yellow-200",
            hoverColor: "hover:from-yellow-200 hover:to-yellow-300"
        },
        {
            icon: <Heart className="text-red-500" size={24} />,
            title: "Akhirnya Bersatu Dalam Cinta",
            date: "Sekarang",
            description: "Defano & Najmita: Ketika Dua Hati Akhirnya Menemukan Jalannya",
            fullStory: "Setelah perjalanan panjang penuh lika-liku, akhirnya Defa dan Nami resmi menjadi pasangan pada 27 September 2024. Defa yang dulunya selalu memilih untuk 'berteman', kini telah yakin bahwa Nami adalah pilihan hatinya. Perjalanan mereka membuktikan bahwa cinta sejati akan selalu menemukan jalannya, meski harus melalui berbagai rintangan dan waktu yang panjang. Kisah mereka adalah bukti bahwa kadang kita harus kehilangan sesuatu dulu untuk menyadari betapa berharganya hal tersebut.",
            color: "bg-gradient-to-br from-red-100 to-red-200",
            hoverColor: "hover:from-red-200 hover:to-red-300"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    return (
        <section className="bg-white py-0 min-h-screen flex items-center">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.h2
                        ref={setTitleRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-5xl font-extrabold text-center mb-6 text-gray-900 leading-tight"
                    >
                        Cerita Cinta Kami
                    </motion.h2>

                    <motion.p
                        ref={setDescRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={descInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        className="text-center text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Perjalanan cinta Defano dan Najmita, dari pertemuan pertama hingga akhirnya bersatu. 
                        Sebuah kisah tentang kesabaran, kesetiaan, dan takdir yang mempertemukan.
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid gap-8 ${
                        isMobile 
                            ? 'grid-cols-1' 
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {storyData.map((story, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.5, 
                                delay: index * 0.2,
                                ease: 'easeOut'
                            }}
                        >
                            <StoryCard
                                story={story}
                                index={index}
                                setSelectedStory={setSelectedStory}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {selectedStory && (
                <Modal 
                    story={selectedStory} 
                    onClose={() => setSelectedStory(null)} 
                />
            )}
        </section>
    );
};

export default StorySection;