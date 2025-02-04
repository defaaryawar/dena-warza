import { useState, useEffect } from 'react';
import { BookOpen, Heart, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StorySection: React.FC = () => {
    const [selectedStory, setSelectedStory] = useState<any>(null);

    useEffect(() => {
        if (selectedStory) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedStory]);

    const storyData = [
        {
            icon: <BookOpen className="text-purple-500" size={24} />,
            title: "Awal Pertemuan",
            description: "Dua orang asing yang tertutup",
            fullStory: "Awalnya, Defano dan Najmita sama-sama cuek. Defano dengan sikap coolnya yang dingin, Najmita dengan pertahanannya sendiri. Mereka berdua sama-sama enggan terbuka, saling mengamati tanpa benar-benar saling mengenal. Tahun 2019 adalah awal pertemuan mereka, tapi bukan cinta pada pandangan pertama. Defano masih belum melihat Najmita sebagai sesuatu yang istimewa. Dia sibuk dengan dunianya sendiri, teman-temannya, dan kebiasaan hidupnya. Baru di tanggal 27 September 2024, semuanya berubah. Defano mulai membuka diri, mulai berani menceritakan kehidupannya, mulai melihat Najmita dengan cara yang berbeda. Baru saat itulah dia mulai menyukai Najmita sepenuh hati, memulai perjalanan cinta yang tak terduga.",
            color: "from-purple-100 to-purple-200"
        },
        {
            icon: <Star className="text-yellow-500" size={24} />,
            title: "Perjalanan Cinta",
            description: "Gimana dua orang beda banget bisa jadian?",
            fullStory: "Lima tahun berlalu, dan boom! 27 September 2024 jadi hari spesial buat mereka. Defano akhirnya nyatain perasaan ke Najmita. Si cewek pinter yang selalu punya cara buat bikin Defano tersenyum. Najmita tuh orangnya super mandiri, dia bisa aja ngatur segalanya. Tapi pas sama Defano, dia jadi manja abis. Defano? Dia tipe cowok yang jarang ngomong, tapi kalo udah sayang, sayang banget! Dia rela nunggu Najmita berapa jam pun, rela ngebawain tas Najmita, rela nemenin dia. Si Najmita yang cerewet dan super aktif, selalu ngebuat Defano ketawa. Defano yang cool dan pendiam, selalu jadi tembok kuat buat Najmita.",
            color: "from-yellow-100 to-yellow-200"
        },
        {
            icon: <Heart className="text-red-500" size={24} />,
            title: "Cinta Kami",
            description: "Defano & Najmita: Dua Dunia Berbeda",
            fullStory: "Defano masih sosok yang tertutup. Pria yang hidupnya terasa flat dan tanpa warna. Najmita? Dia berbeda. Selalu terbuka, selalu bercerita tentang pekerjaannya, tentang suka dukanya. Dia berbagi segala hal - bahkan hal-hal yang kurang mengenakan sekalipun. Tapi Defano? Dia tetap seperti tembok. Punya sedikit cerita, atau mungkin tidak punya cerita menarik sama sekali. Najmita terus berusaha menyelami dunia Defano, mencoba membuat Defano sedikit lebih terbuka. Bukan dengan paksa, tapi dengan kesabaran. Dengan cintanya yang membuat Defano perlahan mulai merasa aman untuk sekedar berbagi sedikit tentang dirinya. Mereka tidak sempsempurna, tapi Najmita yakin suatu saat Defano akan terbuka. Defano Arya Wardhana - pria dengan sedikit kata, tapi Najmita tahu, ada dunia dalam dirinya yang belum tersentuh.",
            color: "from-red-100 to-red-200"
        }
    ];

    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-extrabold text-center mb-8 text-gray-900">
                    Cerita Cinta Kami
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {storyData.map((story, index) => (
                        <div
                            key={index}
                            className={`relative bg-gradient-to-br ${story.color} rounded-2xl p-6 shadow-md`}
                        >
                            <div className="flex items-center mb-4 space-x-4">
                                {story.icon}
                                <h3 className="text-2xl font-bold text-gray-800">{story.title}</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {story.description}
                            </p>
                            <div className="pt-14">
                                <button
                                    onClick={() => setSelectedStory(story)}
                                    className="absolute bottom-5 bg-white/30 text-gray-900 font-semibold py-2 px-4 rounded-full transform transition-all duration-300 cursor-pointer hover:bg-white/50 md:hover:bg-white/50 md:hover:-translate-y-2 md:hover:shadow-2xl"
                                >
                                    Baca Selengkapnya
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-991 flex items-center justify-center p-4 overflow-hidden"
                        onClick={() => setSelectedStory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedStory(null)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center mb-6 space-x-4">
                                {selectedStory.icon}
                                <h2 className="text-3xl font-bold text-gray-800">{selectedStory.title}</h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {selectedStory.description}
                                </p>
                                <p className="text-gray-800 text-lg leading-relaxed">
                                    {selectedStory.fullStory}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default StorySection;