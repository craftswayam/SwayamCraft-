import React from 'react';
import { ShoppingBag, Search, Sparkles, User, LogOut, Package, Shield, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  currentView,
  setCurrentView,
  openAuthModal,
  openOrdersModal,
}) => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const { user, logout, isSeller } = useAuth();

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--color-border)' }}>
      {/* Top announcement bar */}
      <div style={{
        background: 'linear-gradient(90deg, #A54B30, #C86446, #D4AF37)',
        color: '#FFF',
        fontSize: '0.8rem',
        padding: '6px 16px',
        textAlign: 'center',
        fontWeight: 500,
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <Sparkles size={14} />
        <span>Handcrafted Gifting Boutique &bull; Free Personalized Gift Notes on All Orders &bull; Free Delivery over &#8377;999</span>
        <Sparkles size={14} />
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '24px' }}>
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('store')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img
            src="/logo.png"
            alt="SwayamCraft Logo"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'contain',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              background: '#FFF'
            }}
          />
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-charcoal)', letterSpacing: '-0.5px' }}>
              Swayam<span style={{ color: 'var(--color-terracotta)' }}>Craft</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '-2px' }}>
              Artisanal Studio
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {currentView === 'store' && (
          <div style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-muted)' }} />
            <input
              type="text"
              placeholder="Search scented candles, resin art, gift hampers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '0.9rem',
                color: 'var(--color-charcoal)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            />
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Switch between Customer Store & Seller Admin */}
          {isSeller && (
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={currentView === 'admin' ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              style={{ gap: '6px' }}
            >
              {currentView === 'admin' ? <Store size={16} /> : <Shield size={16} />}
              <span>{currentView === 'admin' ? 'Customer Store' : 'Seller Hub'}</span>
            </button>
          )}

          {/* Customer Orders History Button */}
          {user && (
            <button
              onClick={openOrdersModal}
              className="btn-icon"
              title="My Orders"
            >
              <Package size={20} />
            </button>
          )}

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="btn-icon"
            style={{ position: 'relative' }}
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-terracotta)',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(200, 100, 70, 0.5)'
              }}>
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '6px', borderLeft: '1px solid var(--color-border)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-cream-dark)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: '1px solid var(--color-border)'
              }}>
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ display: 'none', flexDirection: 'column' }} className="user-text-meta">
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.fullName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-muted)' }}>
                  {isSeller ? 'Artisan / Seller' : 'Customer'}
                </span>
              </div>
              <button
                onClick={logout}
                className="btn-icon"
                title="Sign Out"
                style={{ width: '34px', height: '34px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
