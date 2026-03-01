import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/Common';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import { LoginPage, SignupPage, OwnerLoginPage, OwnerSignupPage } from './pages/AuthPages';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isOwnerRoute = location.pathname.startsWith('/owner');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/owner/login" element={<OwnerLoginPage />} />
          <Route path="/owner/signup" element={<OwnerSignupPage />} />

          {/* Protected Customer Routes */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="customer"><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute requiredRole="customer"><WishlistPage /></ProtectedRoute>
          } />

          {/* Protected Owner Routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isOwnerRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AppLayout />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'Inter', sans-serif",
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '14px',
              },
              success: {
                style: { background: '#1B1464', color: 'white' },
                iconTheme: { primary: '#D4A017', secondary: 'white' },
              },
              error: {
                style: { background: '#EF4444', color: 'white' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

