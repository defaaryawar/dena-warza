import { Link } from "react-router-dom";
import ModernVideoGallery from "./ElegantVideoGallery";
import LoveJourneyGame from "./LoveJourneyGame";
import MemoryList from "./MemoryList";
import RelationshipStats from "./RelationshipStats";
import StorySection from "./StorySection";
import Album from "./Album";
import ChatbotSelector from "./ChatbotSelector";

const Home = () => {
    return (
        <main className="bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto max-w-7xl px-4 sm:px-2">
                {/* Album Section */}
                <section className="py-3 md:py-3 sticky z-50 top-2">
                    <Album />
                </section>
                <div className="sm:px-2">
                    {/* Stats Section */}
                    <section className="py-3 md:py-3">
                        <RelationshipStats />
                    </section>

                    {/* Memories Section */}
                    <section className="py-5 md:py-5">
                        <div className="flex items-center justify-between mb-0">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                Kenangan Terbaru
                            </h2>
                            <Link
                                to="/galleryall"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                            >
                                Lihat lebih banyak
                            </Link>
                        </div>
                        <MemoryList />
                    </section>

                    {/* Story Section */}
                    <section className="py-2 md:py-2">
                        <StorySection />
                    </section>

                    {/* Video Gallery Section */}
                    <section className="py-3 md:py-3">
                        <ModernVideoGallery />
                    </section>

                    {/* Chatbot Section */}
                    <section className="py-3 md:py-3">
                        <ChatbotSelector />
                    </section>

                    {/* Game Section */}
                    <section className="py-3 md:py-3">
                        <LoveJourneyGame />
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Home;