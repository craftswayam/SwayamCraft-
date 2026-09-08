import React, { useState } from 'react';
import { X, ShoppingBag, Flame, Sparkles, CheckCircle, Heart, Shield, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(
    product.images && product.images.length > 0 ? product.images[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [customGiftMessage, setCustomGiftMessage] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, customGiftMessage);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const images = product.images && product.images.length > 0 ? product.images : [selectedImg];
  const effectivePrice = product.discountPrice || product.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: '0', display: 'flex', flexDirection: 'column' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(255,255,255,0.9)' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Left: Images */}
          <div style={{ padding: '24px', background: '#F8F5EE', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '100%',
              height: '320px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#FFF',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img
                src={selectedImg || images[0]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImg === img ? '2px solid var(--color-terracotta)' : '1px solid var(--color-border)',
                      flexShrink: 0,
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="var(--color-success)" />
                <span>Handcrafted in small artisan batches in India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} color="var(--color-success)" />
                <span>Bubble wrapped and damage-proof gift packaging</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Personalization */}
          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-terracotta">{product.category?.name}</span>
                {product.isFeatured && <span className="badge badge-gold">Featured Craft</span>}
              </div>
              <h2 style={{ fontSize: '1.45rem', lineHeight: 1.3, marginBottom: '10px' }}>
                {product.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  &#8377;{effectivePrice.toFixed(0)}
                </span>
                {product.discountPrice && (
                  <span style={{ fontSize: '1rem', color: 'var(--color-charcoal-muted)', textDecoration: 'line-through' }}>
                    &#8377;{product.price.toFixed(0)}
                  </span>
                )}
                {product.stockQuantity > 0 ? (
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>In Stock</span>
                ) : (
                  <span className="badge" style={{ marginLeft: 'auto', background: '#FFEBEE', color: '#C62828' }}>Out of Stock</span>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Craft Specs */}
            <div style={{
              background: 'var(--color-cream)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {product.fragranceNotes && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Flame size={15} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Fragrance:</strong> {product.fragranceNotes}</div>
                </div>
              )}
              {product.burnTime && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Clock size={15} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Approx Burn Time:</strong> {product.burnTime}</div>
                </div>
              )}
              {product.resinDetails && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Sparkles size={15} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Resin Crafting:</strong> {product.resinDetails}</div>
                </div>
              )}
              {product.dimensions && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>&#128207;</span>
                  <div><strong>Dimensions:</strong> {product.dimensions}</div>
                </div>
              )}
            </div>

            {/* Custom Gift Note / Personalization Input */}
            {product.isCustomizable && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={14} color="var(--color-terracotta)" />
                  <span>Personalize this Gift (Optional):</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 'Engrave: Ananya & Rahul', or note: 'Happy Birthday Sis! Love you.'"
                  value={customGiftMessage}
                  onChange={(e) => setCustomGiftMessage(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 8px',
                background: 'var(--color-surface)'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '28px', height: '28px', fontWeight: 600, fontSize: '1.1rem' }}
                >
                  -
                </button>
                <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 10, quantity + 1))}
                  style={{ width: '28px', height: '28px', fontWeight: 600, fontSize: '1.1rem' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="btn-primary"
                style={{ flex: 1, padding: '14px 20px' }}
              >
                {addedAnimation ? (
                  <>
                    <CheckCircle size={18} />
                    <span>Added to Gift Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Gift Bag &bull; &#8377;{(effectivePrice * quantity).toFixed(0)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
