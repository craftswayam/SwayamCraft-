import React, { useEffect, useState } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ChevronRight, Heart } from 'lucide-react';
import { api } from '../services/api';

export const CustomerOrdersModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const res = await api.getCustomerOrders();
          setOrders(res || []);
        } catch (err) {
          console.error('Failed to load orders:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-gold">Dispatched</span>;
      case 'CRAFTING':
        return <span className="badge badge-terracotta">Artisan Crafting</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '32px' }}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Package size={24} color="var(--color-terracotta)" />
          <h2 style={{ fontSize: '1.4rem' }}>My Gifting Orders</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-charcoal-muted)' }}>
            Loading your gift orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-charcoal-muted)' }}>
            <p>You haven't placed any gift orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{order.orderNumber}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--color-charcoal)' }}>
                  <div><strong>Recipient:</strong> {order.recipientName} ({order.shippingAddress}, {order.city})</div>
                  {order.giftNoteCard && (
                    <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--color-charcoal-muted)' }}>
                      Note: "{order.giftNoteCard}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                    Tracking: <strong>{order.trackingNumber || 'Processing'}</strong>
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    &#8377;{order.totalAmount.toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
