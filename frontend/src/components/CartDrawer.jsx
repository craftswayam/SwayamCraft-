import React from 'react';
import { X, Trash2, ArrowRight, Gift, Truck, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = ({ onProceedToCheckout, onOpenAuth }) => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    giftWrap,
    setGiftWrap,
    giftWrapFee,
    shippingFee,
    grandTotal,
  } = useCart();

  const { user } = useAuth();

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    if (!user) {
      // Trigger sign in first as requested
      onOpenAuth('Please sign in or create an account to proceed with gifting checkout');
    } else {
      // Proceed directly to payment and shipping
      onProceedToCheckout();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(30, 30, 36, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setIsDrawerOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-cream)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--color-terracotta)" />
            <h2 style={{ fontSize: '1.25rem' }}>Your Gift Bag</h2>
            <span className="badge badge-terracotta">{items.reduce((a, b) => a + b.quantity, 0)} items</span>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div style={{ padding: '12px 24px', background: 'var(--color-gold-light)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#7D6018', fontWeight: 600, marginBottom: '6px' }}>
            <Truck size={16} />
            {remainingForFreeShipping > 0 ? (
              <span>Add &#8377;{remainingForFreeShipping} more for FREE shipping</span>
            ) : (
              <span>&#127881; Congratulations! You unlocked FREE shipping!</span>
            )}
          </div>
          <div style={{ height: '6px', background: 'rgba(212,175,55,0.25)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${freeShippingProgress}%`,
              background: 'linear-gradient(90deg, #D4AF37, #C86446)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-cream-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--color-charcoal-muted)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Your gift bag is empty</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '20px' }}>
                Discover handcrafted candles and resin art to add to your collection.
              </p>
              <button onClick={() => setIsDrawerOpen(false)} className="btn-secondary btn-sm">
                Start Exploring
              </button>
            </div>
          ) : (
            items.map((item) => {
              const effectivePrice = item.product.discountPrice || item.product.price;
              const img = item.product.images && item.product.images.length > 0
                ? item.product.images[0]
                : 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-light)'
                  }}
                >
                  <img
                    src={img}
                    alt={item.product.title}
                    style={{ width: '74px', height: '74px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>{item.product.title}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{ color: 'var(--color-charcoal-muted)', padding: '2px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.customGiftMessage && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-terracotta)',
                        background: 'var(--color-terracotta-light)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Heart size={10} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Note: "{item.customGiftMessage}"
                        </span>
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>
                        &#8377;{(effectivePrice * item.quantity).toFixed(0)}
                      </span>

                      {/* Quantity buttons */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 6px',
                        background: 'var(--color-surface)'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ width: '22px', height: '22px', fontSize: '1rem' }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ width: '22px', height: '22px', fontSize: '1rem' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Trigger */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-cream)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Gift Wrap option */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              background: 'var(--color-surface)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)'
            }}>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-terracotta)' }}
              />
              <Gift size={16} color="var(--color-terracotta)" />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>Luxury Gift Packaging (+&#8377;50)</span>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-charcoal-muted)' }}>
                  Hand-tied satin ribbon, wax stamp & greeting envelope
                </div>
              </div>
            </label>

            {/* Price breakdown */}
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-charcoal-muted)' }}>
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toFixed(0)}</span>
              </div>
              {giftWrap && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-charcoal-muted)' }}>
                  <span>Gift Wrapping</span>
                  <span>&#8377;{giftWrapFee}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-charcoal-muted)' }}>
                <span>Standard Delivery</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-charcoal)', paddingTop: '6px', borderTop: '1px solid var(--color-border)' }}>
                <span>Total Amount</span>
                <span>&#8377;{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCheckoutClick}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem', marginTop: '4px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
