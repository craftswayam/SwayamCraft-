import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, promptMessage, onSuccessRedirectToCheckout }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [role, setRole] = useState('ROLE_CUSTOMER'); // ROLE_CUSTOMER or ROLE_SELLER

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
      if (onSuccessRedirectToCheckout) {
        onSuccessRedirectToCheckout();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName,
        email: regEmail,
        password: regPassword,
        phone,
        address,
        city,
        role,
      });
      onClose();
      if (onSuccessRedirectToCheckout) {
        onSuccessRedirectToCheckout();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    try {
      await login({ email: demoEmail, password: demoPassword });
      onClose();
      if (onSuccessRedirectToCheckout) {
        onSuccessRedirectToCheckout();
      }
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '32px' }}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          <X size={18} />
        </button>

        {promptMessage && (
          <div style={{
            background: 'var(--color-gold-light)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.85rem',
            color: '#7D6018',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>{promptMessage}</span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
            {tab === 'login'
              ? 'Sign in to access saved addresses and track gifting orders'
              : 'Join SwayamCraft to personalize gifts and manage deliveries'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--color-cream)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: tab === 'login' ? 'var(--color-surface)' : 'transparent',
              color: tab === 'login' ? 'var(--color-charcoal)' : 'var(--color-charcoal-muted)',
              boxShadow: tab === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: tab === 'register' ? 'var(--color-surface)' : 'transparent',
              color: tab === 'register' ? 'var(--color-charcoal)' : 'var(--color-charcoal-muted)',
              boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Quick Demo Login Chips */}
        {tab === 'login' && (
          <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-charcoal-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              One-Click Quick Logins:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer@swayamcraft.com', 'Customer@123')}
                disabled={loading}
                className="btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 10px' }}
              >
                <User size={13} />
                <span>Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@swayamcraft.com', 'Admin@123')}
                disabled={loading}
                className="btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem', padding: '6px 10px', borderColor: 'var(--color-terracotta)', color: 'var(--color-terracotta)' }}
              >
                <Shield size={13} />
                <span>Artisan Admin</span>
              </button>
            </div>
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
            >
              {loading ? 'Signing In...' : 'Sign In & Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-charcoal-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Create a password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Account Purpose</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.88rem', background: '#FFF' }}
              >
                <option value="ROLE_CUSTOMER">I am shopping for Gifting & Crafts (Customer)</option>
                <option value="ROLE_SELLER">I am an Artisan / Seller (Manage Products & Orders)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '8px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
