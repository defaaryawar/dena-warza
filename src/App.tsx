import './App.css';
import MemoryList from './components/MemoryList';
import StorySection from './components/StorySection';
import { memories } from './data/dataImage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemoryDetail from './pages/MemoryDetail';
import SearchMemories from './pages/SearchMemories';
import Album from './components/Album';
import RelationshipStats from './components/RelationshipStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <div className="container mx-auto max-w-7xl">
          <Routes>
            <Route path="/" element={
              <>
                <Album />
                <RelationshipStats />
                <MemoryList memories={memories} />
                <StorySection />
              </>
            } />
            <Route path="/memory/:id" element={<MemoryDetail />} />
            <Route path="/search" element={<SearchMemories />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;