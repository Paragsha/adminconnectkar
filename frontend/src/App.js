import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

// Pages
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import RentalsPage from './pages/RentalsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import VehiclesPage from './pages/VehiclesPage';
import PropertyPage from './pages/PropertyPage';
import CarpoolPage from './pages/CarpoolPage';
import DailyMealsPage from './pages/DailyMealsPage';
import ResidentServicesPage from './pages/ResidentServicesPage';
import HomeBusinessesPage from './pages/HomeBusinessesPage';
import AdminPage from './pages/AdminPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';

// Layout wrapper
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // If user is authenticated but no profile, redirect to onboarding
  if (user && !userProfile) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" replace />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      
      <Route path="/" element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><Layout><MarketplacePage /></Layout></ProtectedRoute>} />
      <Route path="/marketplace/:category" element={<ProtectedRoute><Layout><MarketplacePage /></Layout></ProtectedRoute>} />
      <Route path="/rentals" element={<ProtectedRoute><Layout><RentalsPage /></Layout></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Layout><CommunityPage /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Layout><VehiclesPage /></Layout></ProtectedRoute>} />
      <Route path="/property" element={<ProtectedRoute><Layout><PropertyPage /></Layout></ProtectedRoute>} />
      <Route path="/carpool" element={<ProtectedRoute><Layout><CarpoolPage /></Layout></ProtectedRoute>} />
      <Route path="/meals" element={<ProtectedRoute><Layout><DailyMealsPage /></Layout></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><Layout><ResidentServicesPage /></Layout></ProtectedRoute>} />
      <Route path="/businesses" element={<ProtectedRoute><Layout><HomeBusinessesPage /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Layout><AdminPage /></Layout></ProtectedRoute>} />
      <Route path="/listing/:id" element={<ProtectedRoute><Layout><ListingDetailPage /></Layout></ProtectedRoute>} />
      <Route path="/create-listing" element={<ProtectedRoute><Layout><CreateListingPage /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
