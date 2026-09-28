import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { AdminDashboard } from './admin/AdminDashboard';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { Sparkles, Heart, Shield, RefreshCw } from 'lucide-react';

export function App() {
  const { user, isSeller } = useAuth();

  // Navigation state: 'store' or 'admin'
  const [currentView, setCurrentView] = useState('store');

  // Products & Categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Fetch initial catalog
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        api.getProducts({ category: selectedCategory, search: searchQuery }),
        api.getCategories(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Handler for Checkout after Auth
  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOpenAuth = (msg = '') => {
    setAuthPromptMessage(msg);
    setIsAuthModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={() => handleOpenAuth()}
        openOrdersModal={() => setIsOrdersModalOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'admin' && isSeller ? (
          <AdminDashboard />
        ) : (
          <div>
            {/* Hero Section */}
            <Hero
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {/* Catalog Grid Section */}
            <section style={{ padding: '40px 0 80px 0' }}>
              <div className="container">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--color-charcoal)' }}>
                      {searchQuery
                        ? `Search results for "${searchQuery}"`
                        : selectedCategory === 'all'
                        ? 'Curated Handcrafted Collection'
                        : categories.find((c) => c.slug === selectedCategory)?.name || 'Artisan Crafts'}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                      Showing {products.length} artisan-made gifting treasures
                    </p>
                  </div>

                  <button
                    onClick={fetchProducts}
                    className="btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                  >
                    <RefreshCw size={14} />
                    <span>Refresh Catalog</span>
                  </button>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-charcoal-muted)' }}>
                    Loading handcrafted crafts...
                  </div>
                ) : products.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <Sparkles size={36} color="var(--color-gold)" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No craft items found</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', marginBottom: '16px' }}>
                      Try adjusting your search terms or filter to see our full artisan collection.
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                      className="btn-primary btn-sm"
                    >
                      View All Gift Items
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                  }}>
                    {products.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onOpenDetails={(p) => setActiveProductModal(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Boutique Footer */}
      <footer style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: '48px 0 28px 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '36px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <img
                  src="/logo.png"
                  alt="SwayamCraft Logo"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    background: '#FFF'
                  }}
                />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>
                  SwayamCraft
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
                An independent gifting atelier celebrating traditional craftsmanship, eco-friendly soy wax blends, and enduring resin keepsakes.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Artisan Collections</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                <li>Hand-Poured Soy Wax Candles</li>
                <li>Botanical & Ocean Resin Art</li>
                <li>Customized Gifting Hampers</li>
                <li>Anniversary & Housewarming Keepsakes</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Our Promise</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={14} color="var(--color-terracotta)" />
                  <span>Free Handwritten Gift Notes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="var(--color-success)" />
                  <span>100% Breakage Protection Guarantee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="var(--color-gold)" />
                  <span>Curated Small-Batch Craftsmanship</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--color-border-light)',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--color-charcoal-muted)'
          }}>
            &copy; {new Date().getFullYear()} SwayamCraft Artisanal Studio. All rights reserved. Powered by Spring Boot 3 &amp; React.
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {activeProductModal && (
        <ProductModal
          product={activeProductModal}
          onClose={() => setActiveProductModal(null)}
        />
      )}

      <CartDrawer
        onProceedToCheckout={handleProceedToCheckout}
        onOpenAuth={(msg) => handleOpenAuth(msg)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        promptMessage={authPromptMessage}
        onSuccessRedirectToCheckout={() => {
          setIsAuthModalOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(ord) => setConfirmedOrder(ord)}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrders={() => setIsOrdersModalOpen(true)}
      />

      <CustomerOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />
    </div>
  );
}
export default App;
