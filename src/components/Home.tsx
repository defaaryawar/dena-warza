import ModernVideoGallery from "./ElegantVideoGallery"
import LoveJourneyGame from "./LoveJourneyGame"
import MemoryList from "./MemoryList"
import RelationshipStats from "./RelationshipStats"
import StorySection from "./StorySection"
import Album from "./Album"
import ChatbotUI from "./ChatBot"

const Home = () => {
    return (
        <>
            <Album />
            <RelationshipStats />
            <MemoryList />
            <StorySection />
            <ModernVideoGallery />
            <ChatbotUI />
            <LoveJourneyGame />
        </>
    )

}

export default Home