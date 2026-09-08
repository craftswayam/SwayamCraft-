import React from 'react';
import { ShoppingBag, Eye, Heart, Sparkles, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          paddingTop: '80%',
          overflow: 'hidden',
          backgroundColor: '#F7F3EE',
          cursor: 'pointer'
        }}
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={mainImage}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {discountPercent > 0 && (
            <span className="badge badge-terracotta">
              SAVE {discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge badge-gold">
              <Sparkles size={11} /> Bestseller
            </span>
          )}
        </div>

        {/* Stock status badge */}
        {isLowStock && (
          <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
            <span className="badge badge-warning">
              Only {product.stockQuantity} left
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
            <span className="badge" style={{ background: '#E0E0E0', color: '#616161' }}>
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.9)',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Quick View & Personalize"
        >
          <Eye size={17} />
        </button>
      </div>

      {/* Product Information */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-terracotta)', fontWeight: 600, marginBottom: '6px' }}>
          {product.category?.name || 'Handcrafted Craft'}
        </div>

        <h3
          onClick={() => onOpenDetails(product)}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.35,
            marginBottom: '8px',
            cursor: 'pointer',
            minHeight: '2.7em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.title}
        </h3>

        {/* Specific craft attribute teaser */}
        {product.fragranceNotes && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginBottom: '12px' }}>
            <Flame size={14} color="var(--color-terracotta)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.fragranceNotes}
            </span>
          </div>
        )}
        {product.resinDetails && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', marginBottom: '12px' }}>
            <Sparkles size={14} color="var(--color-gold)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.resinDetails}
            </span>
          </div>
        )}

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                &#8377;{product.discountPrice ? product.discountPrice.toFixed(0) : product.price.toFixed(0)}
              </span>
              {product.discountPrice && (
                <span style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', textDecoration: 'line-through' }}>
                  &#8377;{product.price.toFixed(0)}
                </span>
              )}
            </div>
            {product.isCustomizable && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 600 }}>
                &bull; Personalization Available
              </span>
            )}
          </div>

          <button
            onClick={() => onOpenDetails(product)}
            className="btn-primary btn-sm"
            disabled={isOutOfStock}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              opacity: isOutOfStock ? 0.6 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingBag size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
