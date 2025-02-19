import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Star } from 'lucide-react';
import StoryCard from './StorySection/StoryCard';
import Modal from './StorySection/Modal';
import { useIsMobile } from '../hooks/isMobile';

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
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const isMobile = useIsMobile();

    useEffect(() => {
        document.body.style.overflow = selectedStory ? 'hidden' : 'unset';
    }, [selectedStory]);

    const storyData: Story[] = [
        {
            icon: <BookOpen className="text-purple-500" size={24} />,
            title: "Awal Pertemuan",
            date: "2019",
            description: "Dua orang asing yang tertutup",
            fullStory: "Awalnya, Defano dan Najmita sama-sama cuek. Defano dengan sikap coolnya yang dingin, Najmita dengan pertahanannya sendiri. Mereka berdua sama-sama enggan terbuka, saling mengamati tanpa benar-benar saling mengenal. Tahun 2019 adalah awal pertemuan mereka, tapi bukan cinta pada pandangan pertama. Defano masih belum melihat Najmita sebagai sesuatu yang istimewa. Dia sibuk dengan dunianya sendiri, teman-temannya, dan kebiasaan hidupnya. Baru di tanggal 27 September 2024, semuanya berubah. Defano mulai membuka diri, mulai berani menceritakan kehidupannya, mulai melihat Najmita dengan cara yang berbeda. Baru saat itulah dia mulai menyukai Najmita sepenuh hati, memulai perjalanan cinta yang tak terduga.",
            color: "bg-gradient-to-br from-purple-100 to-purple-200",
            hoverColor: "hover:from-purple-200 hover:to-purple-300"
        },
        {
            icon: <Star className="text-yellow-500" size={24} />,
            title: "Perjalanan Cinta",
            date: "27 September 2024",
            description: "Gimana dua orang beda banget bisa jadian?",
            fullStory: "Lima tahun berlalu, dan boom! 27 September 2024 jadi hari spesial buat mereka. Defano akhirnya nyatain perasaan ke Najmita. Si cewek pinter yang selalu punya cara buat bikin Defano tersenyum. Najmita tuh orangnya super mandiri, dia bisa aja ngatur segalanya. Tapi pas sama Defano, dia jadi manja abis. Defano? Dia tipe cowok yang jarang ngomong, tapi kalo udah sayang, sayang banget! Dia rela nunggu Najmita berapa jam pun, rela ngebawain tas Najmita, rela nemenin dia. Si Najmita yang cerewet dan super aktif, selalu ngebuat Defano ketawa. Defano yang cool dan pendiam, selalu jadi tembok kuat buat Najmita.",
            color: "bg-gradient-to-br from-yellow-100 to-yellow-200",
            hoverColor: "hover:from-yellow-200 hover:to-yellow-300"
        },
        {
            icon: <Heart className="text-red-500" size={24} />,
            title: "Cinta Kami",
            date: "Sekarang",
            description: "Defano & Najmita: Dua Dunia Berbeda",
            fullStory: "Defano masih sosok yang tertutup. Pria yang hidupnya terasa flat dan tanpa warna. Najmita? Dia berbeda. Selalu terbuka, selalu bercerita tentang pekerjaannya, tentang suka dukanya. Dia berbagi segala hal - bahkan hal-hal yang kurang mengenakan sekalipun. Tapi Defano? Dia tetap seperti tembok. Punya sedikit cerita, atau mungkin tidak punya cerita menarik sama sekali. Najmita terus berusaha menyelami dunia Defano, mencoba membuat Defano sedikit lebih terbuka. Bukan dengan paksa, tapi dengan kesabaran. Dengan cintanya yang membuat Defano perlahan mulai merasa aman untuk sekedar berbagi sedikit tentang dirinya. Mereka tidak sempurna, tapi Najmita yakin suatu saat Defano akan terbuka. Defano Arya Wardhana - pria dengan sedikit kata, tapi Najmita tahu, ada dunia dalam dirinya yang belum tersentuh.",
            color: "bg-gradient-to-br from-red-100 to-red-200",
            hoverColor: "hover:from-red-200 hover:to-red-300"
        }
    ];

    return (
        <section className="bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900">
                    Cerita Cinta Kami
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Perjalanan cinta Defano dan Najmita, dari awal pertemuan hingga saat ini.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {storyData.map((story, index) => (
                        <StoryCard
                            key={index}
                            story={story}
                            index={index}
                            setActiveIndex={setActiveIndex}
                            setSelectedStory={setSelectedStory}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>

            {selectedStory && <Modal story={selectedStory} onClose={() => setSelectedStory(null)} />}
        </section>
    );
};

export default StorySection;