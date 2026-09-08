import React from 'react';
import { Flame, Sparkles, Gift, Heart, ShieldCheck } from 'lucide-react';

export const Hero = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <section style={{
      background: 'linear-gradient(180deg, #F9F5EE 0%, var(--color-cream) 100%)',
      padding: '48px 0 24px 0',
      borderBottom: '1px solid var(--color-border-light)'
    }}>
      <div className="container">
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            color: 'var(--color-terracotta)',
            fontWeight: 600,
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={15} color="var(--color-gold)" />
            <span>Handmade Studio for Meaningful Gifting</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            color: 'var(--color-charcoal)',
            marginBottom: '16px',
            lineHeight: 1.15
          }}>
            Handmade with Love, <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--color-terracotta), var(--color-gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Gifted with Soul
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            Explore artisan soy candles infused with botanical scents, hand-poured crystal resin art pieces, and bespoke gifting hampers designed to make any occasion unforgettable.
          </p>

          {/* Value Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '36px',
            fontSize: '0.85rem',
            color: 'var(--color-charcoal)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="var(--color-terracotta)" />
              <span>100% Pure Soy Wax</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--color-gold)" />
              <span>Crystal Clear Art Resin</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={16} color="var(--color-terracotta)" />
              <span>Free Custom Gift Notes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>Safe & Secure Packaging</span>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '12px'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: selectedCategory === 'all' ? 'var(--color-charcoal)' : 'var(--color-surface)',
              color: selectedCategory === 'all' ? '#FFF' : 'var(--color-charcoal)',
              border: `1px solid ${selectedCategory === 'all' ? 'var(--color-charcoal)' : 'var(--color-border)'}`,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Gift size={16} />
            <span>All Craft Gifts</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: isSelected ? 'var(--color-terracotta)' : 'var(--color-surface)',
                  color: isSelected ? '#FFF' : 'var(--color-charcoal)',
                  border: `1px solid ${isSelected ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
