import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import ProtectedRoute from './ProtectedRoute';
import MemoryDetail from './pages/MemoryDetail';
import SearchMemories from './pages/SearchMemories';
import MemoriesPage from './pages/MemoriesPage';
import PinAuthentication from './pages/PinAuthentication';
import ScrollToTop from './hooks/useScrollToTop';
import Home from './components/Home';
import TambahKenangan from './pages/AddMemoryPage';
import EditMemoryPage from './pages/EditMemoryPage';
import LovePopup from './components/LovePopup';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <LovePopup />
        
            <Routes>
              {/* Rute untuk Autentikasi PIN */}
              <Route path="/pin" element={<PinAuthentication />} />

              {/* Rute yang Dilindungi */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/memory/:id" element={<MemoryDetail />} />
                <Route path="/search" element={<SearchMemories />} />
                <Route path="/galleryall" element={<MemoriesPage />} />
                <Route path="/add-memory" element={<TambahKenangan />} />
                <Route path="/edit-memory" element={<EditMemoryPage />} />
              </Route>

              {/* Redirect ke halaman PIN jika tidak ada rute yang cocok */}
              <Route path="*" element={<Navigate to="/pin" replace />} />
            </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;