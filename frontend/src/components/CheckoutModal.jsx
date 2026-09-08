import React, { useState } from 'react';
import { X, CreditCard, QrCode, Building2, Truck, ShieldCheck, CheckCircle2, Heart, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { items, subtotal, giftWrap, giftWrapFee, shippingFee, grandTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState(user?.address || 'Flat 204, Rosewood Gardens, Indiranagar');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '560038');
  const [giftNoteCard, setGiftNoteCard] = useState('Wishing you warmth, light, and beautiful moments!');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NETBANKING, COD

  // Card form mock state
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    setProcessingStep('Connecting to secure payment gateway...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Authorizing payment with bank...');
      await new Promise((r) => setTimeout(r, 700));

      const clientItems = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        customGiftMessage: i.customGiftMessage,
      }));

      const orderPayload = {
        recipientName,
        contactPhone,
        shippingAddress,
        city,
        state,
        postalCode,
        giftNoteCard,
        giftWrap,
        paymentMethod,
        clientItems,
      };

      const completedOrder = await api.checkout(orderPayload);
      setProcessingStep('Finalizing your handcrafted gift order...');
      await new Promise((r) => setTimeout(r, 500));

      clearCart();
      onClose();
      onOrderSuccess(completedOrder);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '32px' }}
      >
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          <X size={18} />
        </button>

        {isProcessing ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: 'var(--color-terracotta)',
              animation: 'spin 1.5s linear infinite'
            }}>
              <Loader2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Processing Your Gifting Order</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-charcoal-muted)' }}>
              {processingStep}
            </p>
            <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>256-bit encrypted end-to-end payment security</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-gold">Secure Checkout</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>Logged in as {user?.email}</span>
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>Complete Your Gifting Order</h2>
            </div>

            {error && (
              <div style={{
                background: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            {/* Section 1: Recipient & Delivery */}
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="var(--color-terracotta)" />
                <span>1. Recipient & Delivery Address</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Recipient's Full Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Contact Phone (for delivery)</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>Street Address / Flat No.</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>PIN Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Personal Gift Card Message */}
            <div style={{ background: 'var(--color-cream)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                <Heart size={15} color="var(--color-terracotta)" />
                <span>Complimentary Hand-Written Card Message Enclosed with Gift:</span>
              </label>
              <textarea
                rows={2}
                value={giftNoteCard}
                onChange={(e) => setGiftNoteCard(e.target.value)}
                placeholder="Write your personal message to be handwritten on an artisanal card..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem', background: '#FFF' }}
              />
            </div>

            {/* Section 3: Payment Method */}
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} color="var(--color-terracotta)" />
                <span>2. Select Payment Option</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'Instant UPI' },
                  { id: 'CARD', label: 'Cards', icon: CreditCard, desc: 'Visa / MC / RuPay' },
                  { id: 'NETBANKING', label: 'NetBanking', icon: Building2, desc: 'All Banks' },
                  { id: 'COD', label: 'COD', icon: Truck, desc: 'Cash on Delivery' },
                ].map((method) => {
                  const isSelected = paymentMethod === method.id;
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        border: `2px solid ${isSelected ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-terracotta-light)' : 'var(--color-surface)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={22} color={isSelected ? 'var(--color-terracotta)' : 'var(--color-charcoal)'} style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? 'var(--color-terracotta)' : 'var(--color-charcoal)' }}>
                        {method.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-charcoal-muted)' }}>{method.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Payment Method UI */}
              {paymentMethod === 'UPI' && (
                <div style={{ background: '#F8F5EE', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-gold)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#FFF',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: 'var(--color-terracotta)'
                  }}>
                    SWAYAM<br />CRAFT<br />UPI QR
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Instant UPI Payment: swayamcraft@upi</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-charcoal-muted)' }}>
                      Supports Google Pay, PhonePe, Paytm, and all BHIM UPI apps. Simulated instant confirmation.
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div style={{ background: '#F8F5EE', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.88rem', background: '#FFF' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.88rem', background: '#FFF' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.88rem', background: '#FFF' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div style={{ background: '#F8F5EE', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-charcoal)' }}>
                  Pay cash or UPI to the delivery executive when your carefully packed gift arrives at the doorstep.
                </div>
              )}
            </div>

            {/* Total summary & Action */}
            <div style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>Final Payable:</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  &#8377;{grandTotal.toFixed(0)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary"
                style={{ padding: '14px 32px', borderRadius: 'var(--radius-full)', fontSize: '1rem' }}
              >
                <span>Pay &#8377;{grandTotal.toFixed(0)} & Place Order</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
