import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import {
  FeaturedSection,
  FlashSaleSection,
  CraftsmanshipStory,
  CustomerReviewsSection,
  ContactAndNewsletter,
} from './components/HomeSections';
import { ShopCatalog } from './components/ShopCatalog';
import { WishlistView } from './components/WishlistView';
import { AdminPanel } from './components/AdminPanel';
import {
  AboutUsPage,
  FAQPage,
  DeliveryInfoPage,
  ReturnPolicyPage,
  TermsPolicyPage,
  PrivacyPolicyPage,
} from './components/StaticPages';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { CheckoutPage } from './components/CheckoutPage';
import { LoadingScreen } from './components/LoadingScreen';

const AppContent: React.FC = () => {
  const { currentPage, toastMessage, isLoading, settings } = useStore();
  const [bootReady, setBootReady] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setBootReady(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!bootReady) {
    return <LoadingScreen storeName={settings.storeName || 'উপহার বিতান'} />;
  }

  // Dedicated Admin Console Page
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <AdminPanel />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs py-2.5 px-4 rounded-xl shadow-xl border border-stone-700 animate-slide-up flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#BE9346]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] overflow-x-hidden w-full max-w-full">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 lg:pb-0 w-full max-w-full overflow-x-hidden">
        {currentPage === 'home' && (
          <>
            <HeroSlider />
            <Hero />
            <CategoryShowcase />
            <FeaturedSection />
            <CraftsmanshipStory />
            <FlashSaleSection />
            <CustomerReviewsSection />
            <ContactAndNewsletter />
          </>
        )}

        {currentPage === 'shop' && <ShopCatalog />}

        {currentPage === 'wishlist' && <WishlistView />}

        {currentPage === 'checkout' && <CheckoutPage />}

        {currentPage === 'about' && <AboutUsPage />}

        {currentPage === 'faq' && <FAQPage />}

        {currentPage === 'delivery' && <DeliveryInfoPage />}

        {currentPage === 'returns' && <ReturnPolicyPage />}

        {currentPage === 'terms' && <TermsPolicyPage />}

        {currentPage === 'privacy' && <PrivacyPolicyPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      {currentPage !== 'checkout' && <CheckoutModal />}
      <OrderSuccessModal />
      <OrderTrackingModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-stone-100 text-xs py-2.5 px-4 rounded-xl shadow-xl border border-stone-700 animate-slide-up flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#BE9346]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
