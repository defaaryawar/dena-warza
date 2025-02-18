import ModernVideoGallery from "./ElegantVideoGallery"
import LoveJourneyGame from "./LoveJourneyGame"
import MemoryList from "./MemoryList"
import RelationshipStats from "./RelationshipStats"
import StorySection from "./StorySection"
import Album from "./Album"
import ChatbotUI from "./ChatBot"
import { Link } from "react-router-dom"

const Home = () => {
    return (
        <>
            <div className="min-h-screen px-4 py-0">
                <div className="container mx-auto max-w-7xl">
                    <Album />
                    <RelationshipStats />
                    <div>
                        {/* Title Section */}
                        <div className="flex items-center justify-between mb-0 px-4 sm:px-6 md:px-8">
                            <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                                Kenangan Terbaru
                            </h2>
                            <Link to="/galleryall"
                                className="text-blue-600 font-semibold underline cursor-pointer text-xs z-100">
                                Lihat lebih banyak
                            </Link>
                        </div>
                        <MemoryList />
                    </div>
                    <StorySection />
                    <ModernVideoGallery />
                    <ChatbotUI />
                    <LoveJourneyGame />
                </div>
            </div>
        </>
    )

}

export default Home