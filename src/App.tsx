import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

// Import your components
// import MemoryList from './components/MemoryList';
// import StorySection from './components/StorySection';
// import { memories } from './data/dataImage';
import MemoryDetail from './pages/MemoryDetail';
import SearchMemories from './pages/SearchMemories';
// import Album from './components/Album';
// import RelationshipStats from './components/RelationshipStats';
import MemoriesPage from './pages/MemoriesPage';
import PinAuthentication from './pages/PinAuthentication';
// import ModernVideoGallery from './components/ElegantVideoGallery';
import ScrollToTop from './hooks/useScrollToTop';
// import ChatbotUI from './components/ChatBot';
// import LoveAdventureGame from './components/LoveJourneyGame';
import Home from './components/Home';
import TambahKenangan from './pages/AddMemoryPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = sessionStorage.getItem('authToken'); // Periksa token

  // Jika token tidak ada, arahkan ke halaman PIN
  if (!authToken) {
    return <Navigate to="/pin" replace />;
  }

  return children; // Jika ada token, tampilkan anak
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />

        <div className="min-h-screen px-4 py-0">
          <div className="container mx-auto max-w-7xl">
            <Routes>

              {/* Rute untuk Autentikasi PIN */}
              <Route path="/pin" element={<PinAuthentication />} />

              {/* Rute Beranda yang Dilindungi */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <Home />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* Rute Detail yang Dilindungi */}
              <Route
                path="/memory/:id"
                element={
                  <ProtectedRoute>
                    <MemoryDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchMemories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/galleryall"
                element={
                  <ProtectedRoute>
                    <MemoriesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-memory"
                element={
                  <TambahKenangan />
                }
              />

              {/* Redirect ke halaman PIN jika tidak ada rute yang cocok */}
              <Route path="*" element={<Navigate to="/pin" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;