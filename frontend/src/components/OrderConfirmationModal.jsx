import React from 'react';
import { X, CheckCircle2, Sparkles, Package, Truck, Calendar, MapPin, Heart } from 'lucide-react';

export const OrderConfirmationModal = ({ order, onClose, onViewOrders }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: '36px 32px' }}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)'
          }}>
            <CheckCircle2 size={38} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-terracotta)', fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px' }}>
            <Sparkles size={14} />
            <span>Thank You for Supporting Handcrafted Art</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Gift Order Confirmed!</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
            We've received your order and our artisans are preparing your package.
          </p>
        </div>

        {/* Order Details Card */}
        <div style={{
          background: 'var(--color-cream)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: '20px',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase' }}>Order Number</div>
              <strong style={{ fontSize: '1rem', color: 'var(--color-charcoal)' }}>{order.orderNumber}</strong>
            </div>
            <span className="badge badge-success">{order.paymentStatus}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--color-charcoal-muted)', display: 'block' }}>Recipient:</span>
              <strong>{order.recipientName}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>{order.shippingAddress}, {order.city}</div>
            </div>
            <div>
              <span style={{ color: 'var(--color-charcoal-muted)', display: 'block' }}>Payment Method:</span>
              <strong>{order.paymentMethod}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Tracking: {order.trackingNumber || 'Assigned soon'}</div>
            </div>
          </div>

          {order.giftNoteCard && (
            <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)', fontSize: '0.82rem' }}>
              <div style={{ color: 'var(--color-terracotta)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <Heart size={12} />
                <span>Gift Card Message:</span>
              </div>
              <div style={{ fontStyle: 'italic', color: 'var(--color-charcoal)' }}>
                "{order.giftNoteCard}"
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-charcoal)' }}>
            Fulfillment Timeline:
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {[
              { step: 'Order Placed', active: true, icon: CheckCircle2 },
              { step: 'Artisan Crafting', active: true, icon: Sparkles },
              { step: 'Quality Sealed', active: false, icon: Package },
              { step: 'Delivered', active: false, icon: Truck },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: st.active ? 'var(--color-terracotta)' : 'var(--color-cream-dark)',
                    color: st.active ? '#FFF' : 'var(--color-charcoal-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 6px auto',
                    boxShadow: st.active ? '0 2px 8px rgba(200,100,70,0.3)' : 'none'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: st.active ? 600 : 400, color: st.active ? 'var(--color-charcoal)' : 'var(--color-charcoal-muted)' }}>
                    {st.step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { onClose(); onViewOrders(); }}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            <Package size={16} />
            <span>Track Order</span>
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ flex: 1 }}
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
