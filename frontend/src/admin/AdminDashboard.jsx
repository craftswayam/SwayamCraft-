import React, { useState, useEffect } from 'react';
import {
  Package, DollarSign, TrendingUp, AlertTriangle, Plus, Edit2, Trash2,
  Upload, Check, X, Shield, RefreshCw, Truck, BarChart3, Filter, Flame, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'products', 'orders'
  const [reportData, setReportData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedProductIdForImage, setSelectedProductIdForImage] = useState(null);

  // Quick Price Edit inline state
  const [inlineEditingPriceId, setInlineEditingPriceId] = useState(null);
  const [inlinePriceValue, setInlinePriceValue] = useState('');
  const [inlineDiscountValue, setInlineDiscountValue] = useState('');

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newStock, setNewStock] = useState('15');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFragranceNotes, setNewFragranceNotes] = useState('');
  const [newResinDetails, setNewResinDetails] = useState('');
  const [newBurnTime, setNewBurnTime] = useState('');
  const [newDimensions, setNewDimensions] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rep, prods, ords, cats] = await Promise.all([
        api.adminGetReports().catch(() => null),
        api.adminGetProducts().catch(() => []),
        api.adminGetOrders().catch(() => []),
        api.getCategories().catch(() => []),
      ]);
      setReportData(rep);
      setProducts(prods || []);
      setOrders(ords || []);
      setCategories(cats || []);
      if (cats && cats.length > 0 && !newCategoryId) {
        setNewCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Inline Price Fixing
  const handleStartPriceEdit = (prod) => {
    setInlineEditingPriceId(prod.id);
    setInlinePriceValue(prod.price.toString());
    setInlineDiscountValue(prod.discountPrice ? prod.discountPrice.toString() : '');
  };

  const handleSavePrice = async (prodId) => {
    try {
      const updated = await api.adminUpdatePrice(prodId, {
        price: parseFloat(inlinePriceValue),
        discountPrice: inlineDiscountValue ? parseFloat(inlineDiscountValue) : null,
      });
      setProducts((prev) => prev.map((p) => (p.id === prodId ? updated : p)));
      setInlineEditingPriceId(null);
      showToast('Price updated successfully!');
      // refresh reports in background
      api.adminGetReports().then(setReportData).catch(() => null);
    } catch (err) {
      alert('Failed to update price: ' + err.message);
    }
  };

  // Quick Stock Adjustment
  const handleUpdateStock = async (prodId, currentStock, delta) => {
    const newStockVal = Math.max(0, currentStock + delta);
    try {
      const updated = await api.adminUpdateStock(prodId, { stockQuantity: newStockVal });
      setProducts((prev) => prev.map((p) => (p.id === prodId ? updated : p)));
      showToast(`Stock updated to ${newStockVal}`);
    } catch (err) {
      alert('Failed to update stock: ' + err.message);
    }
  };

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle,
        description: newDescription,
        categoryId: parseInt(newCategoryId),
        price: parseFloat(newPrice),
        discountPrice: newDiscountPrice ? parseFloat(newDiscountPrice) : null,
        stockQuantity: parseInt(newStock),
        images: newImageUrl ? [newImageUrl] : [],
        fragranceNotes: newFragranceNotes || null,
        resinDetails: newResinDetails || null,
        burnTime: newBurnTime || null,
        dimensions: newDimensions || null,
        isCustomizable: true,
      };

      const created = await api.adminCreateProduct(payload);
      setProducts([created, ...products]);
      setIsAddModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewPrice('');
      setNewDiscountPrice('');
      setNewImageUrl('');
      setNewFragranceNotes('');
      setNewResinDetails('');
      showToast('Craft product added to catalog!');
      loadAllData();
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  // File Upload for Image
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProductIdForImage) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.adminUploadImage(formData);
      if (res && res.imageUrl) {
        // Add image to product
        const prod = products.find((p) => p.id === selectedProductIdForImage);
        if (prod) {
          const updatedImages = [...(prod.images || []), res.imageUrl];
          const updatedProd = await api.adminUpdateProduct(prod.id, {
            ...prod,
            categoryId: prod.category?.id,
            images: updatedImages,
          });
          setProducts((prev) => prev.map((p) => (p.id === prod.id ? updatedProd : p)));
          showToast('Image uploaded and attached to craft!');
        }
      }
      setIsImageUploadOpen(false);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this craft item from the public catalog?')) return;
    try {
      await api.adminDeleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product archived.');
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // Order Status Update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await api.adminUpdateOrderStatus(orderId, {
        status: newStatus,
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order status updated to ${newStatus}`);
      api.adminGetReports().then(setReportData).catch(() => null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '32px 0 60px 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Toast Alert */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--color-charcoal)',
            color: '#FFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}>
            <Check size={16} color="var(--color-gold)" />
            <span>{toast}</span>
          </div>
        )}

        {/* Dashboard Title & Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-gold">
                <Shield size={12} /> Artisan Control Panel
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>SwayamCraft Admin</span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>Seller & Studio Hub</h1>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'var(--color-surface)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setActiveTab('reports')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: activeTab === 'reports' ? 'var(--color-charcoal)' : 'transparent',
                color: activeTab === 'reports' ? '#FFF' : 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <BarChart3 size={15} />
              <span>Reports & Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: activeTab === 'products' ? 'var(--color-charcoal)' : 'transparent',
                color: activeTab === 'products' ? '#FFF' : 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Package size={15} />
              <span>Catalog & Pricing ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: activeTab === 'orders' ? 'var(--color-charcoal)' : 'transparent',
                color: activeTab === 'orders' ? '#FFF' : 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Truck size={15} />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sales Revenue</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-gold-light)', color: '#8C6D1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  &#8377;{reportData?.totalRevenue ? reportData.totalRevenue.toFixed(0) : '0'}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>&uarr; Verified from completed orders</span>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-terracotta-light)', color: 'var(--color-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {reportData?.totalOrders || 0}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                  {reportData?.craftingOrders || 0} currently being handcrafted
                </span>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Products</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-cream-dark)', color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {reportData?.totalProducts || products.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                  Candles, Resin & Hampers
                </span>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Low Stock Alert</span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: (reportData?.lowStockCount || 0) > 0 ? 'var(--color-warning)' : 'var(--color-charcoal)' }}>
                  {reportData?.lowStockCount || 0}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                  Craft items with stock &le; 5
                </span>
              </div>
            </div>

            {/* Category Breakdown & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Catalog Distribution by Category</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {reportData?.categoryProductCounts && Object.entries(reportData.categoryProductCounts).map(([catName, count]) => (
                    <div key={catName}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{catName}</span>
                        <strong>{count} items</strong>
                      </div>
                      <div style={{ height: '8px', background: 'var(--color-cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (count / (products.length || 1)) * 100)}%`,
                          background: catName.includes('Candle') ? 'var(--color-terracotta)' : 'var(--color-gold)',
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Watchlist */}
              <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="var(--color-warning)" />
                  <span>Studio Inventory Watchlist</span>
                </h3>
                {reportData?.lowStockProducts && reportData.lowStockProducts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {reportData.lowStockProducts.map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>{p.category?.name}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-warning">{p.stockQuantity} remaining</span>
                          <button
                            onClick={() => handleUpdateStock(p.id, p.stockQuantity, 10)}
                            className="btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            +10 Stock
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '0.85rem' }}>
                    All craft inventory levels are healthy!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG & PRICING MANAGEMENT */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Artisan Product Catalog</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                  Add new craft items, adjust prices with one click, or upload fresh photos.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
                style={{ gap: '6px' }}
              >
                <Plus size={16} />
                <span>Add New Craft Item</span>
              </button>
            </div>

            {/* Products Table */}
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '14px 16px' }}>Product</th>
                    <th style={{ padding: '14px 16px' }}>Category</th>
                    <th style={{ padding: '14px 16px' }}>Price (&#8377;)</th>
                    <th style={{ padding: '14px 16px' }}>Stock</th>
                    <th style={{ padding: '14px 16px' }}>Photos</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isInlineEditing = inlineEditingPriceId === p.id;
                    const img = p.images && p.images.length > 0 ? p.images[0] : '';

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={img || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{p.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)' }}>
                              {p.fragranceNotes ? `Fragrance: ${p.fragranceNotes}` : p.resinDetails ? `Resin: ${p.resinDetails}` : 'Handmade'}
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span className="badge badge-terracotta" style={{ fontSize: '0.72rem' }}>
                            {p.category?.name || 'Craft'}
                          </span>
                        </td>

                        {/* Price Column (Inline Price Fixer) */}
                        <td style={{ padding: '12px 16px' }}>
                          {isInlineEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input
                                type="number"
                                placeholder="Price"
                                value={inlinePriceValue}
                                onChange={(e) => setInlinePriceValue(e.target.value)}
                                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-terracotta)', fontSize: '0.85rem' }}
                              />
                              <input
                                type="number"
                                placeholder="Sale (opt)"
                                value={inlineDiscountValue}
                                onChange={(e) => setInlineDiscountValue(e.target.value)}
                                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                              />
                              <button
                                onClick={() => handleSavePrice(p.id)}
                                className="btn-icon"
                                style={{ width: '28px', height: '28px', background: 'var(--color-success-bg)', color: 'var(--color-success)' }}
                                title="Save Price"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setInlineEditingPriceId(null)}
                                className="btn-icon"
                                style={{ width: '28px', height: '28px' }}
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div>
                                <span style={{ fontWeight: 700 }}>
                                  &#8377;{p.discountPrice ? p.discountPrice : p.price}
                                </span>
                                {p.discountPrice && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', textDecoration: 'line-through', marginLeft: '4px' }}>
                                    &#8377;{p.price}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleStartPriceEdit(p)}
                                style={{ color: 'var(--color-terracotta)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                Fix Price
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Stock Column */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleUpdateStock(p.id, p.stockQuantity, -1)}
                              style={{ width: '22px', height: '22px', background: 'var(--color-cream-dark)', borderRadius: '4px', fontWeight: 700 }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{p.stockQuantity}</span>
                            <button
                              onClick={() => handleUpdateStock(p.id, p.stockQuantity, 1)}
                              style={{ width: '22px', height: '22px', background: 'var(--color-cream-dark)', borderRadius: '4px', fontWeight: 700 }}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Image Upload Trigger */}
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => {
                              setSelectedProductIdForImage(p.id);
                              setIsImageUploadOpen(true);
                            }}
                            className="btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px' }}
                          >
                            <Upload size={12} />
                            <span>Add Photo</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn-icon"
                            style={{ color: 'var(--color-danger)', width: '32px', height: '32px' }}
                            title="Remove Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Customer Orders & Fulfillment</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
                View customer gift addresses, read personalized gift messages, and mark orders as Handcrafted or Shipped.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                  No customer orders received yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '1.05rem' }}>{ord.orderNumber}</strong>
                          <span className="badge badge-gold">{ord.paymentMethod}</span>
                          <span className="badge badge-success">{ord.paymentStatus}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-charcoal-muted)' }}>
                          Placed on {new Date(ord.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Status Change Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-cream)',
                            fontWeight: 600,
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CRAFTING">Artisan Crafting</option>
                          <option value="SHIPPED">Shipped / Dispatched</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                      <div style={{ background: 'var(--color-cream)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Recipient & Delivery:</strong>
                        <div>{ord.recipientName} ({ord.contactPhone})</div>
                        <div style={{ color: 'var(--color-charcoal-muted)' }}>{ord.shippingAddress}, {ord.city}, {ord.state} - {ord.postalCode}</div>
                      </div>

                      <div style={{ background: 'var(--color-cream)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Gift Packaging & Note:</strong>
                        <div>Gift Wrap: {ord.giftWrapFee > 0 ? 'Yes (Luxury Satin Ribbon)' : 'Standard'}</div>
                        {ord.giftNoteCard ? (
                          <div style={{ fontStyle: 'italic', color: 'var(--color-terracotta)', marginTop: '4px' }}>
                            Card: "{ord.giftNoteCard}"
                          </div>
                        ) : (
                          <div style={{ color: 'var(--color-charcoal-muted)' }}>No custom card requested</div>
                        )}
                      </div>

                      <div style={{ background: 'var(--color-cream)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Financials:</strong>
                        <div>Total Paid: <strong>&#8377;{ord.totalAmount.toFixed(0)}</strong></div>
                        <div style={{ color: 'var(--color-charcoal-muted)' }}>Tracking Code: {ord.trackingNumber || 'Not assigned'}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD NEW CRAFT ITEM */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '32px' }}>
              <button onClick={() => setIsAddModalOpen(false)} className="btn-icon" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <X size={18} />
              </button>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '18px' }}>Add New Craft Gift Item</h2>

              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amber Lotus Soy Wax Candle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                    <select
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: '#FFF' }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Stock Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Price (&#8377;)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="e.g. 899"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Discounted Sale Price (&#8377;, Optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 749"
                      value={newDiscountPrice}
                      onChange={(e) => setNewDiscountPrice(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the artisan craft, materials, scent notes or epoxy finish..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Photo Image URL (or upload later)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Fragrance Notes (Candles)</label>
                    <input
                      type="text"
                      placeholder="e.g. Bergamot, Sandalwood"
                      value={newFragranceNotes}
                      onChange={(e) => setNewFragranceNotes(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Resin Details (Resin Art)</label>
                    <input
                      type="text"
                      placeholder="e.g. Real dried marigold, gold leaf"
                      value={newResinDetails}
                      onChange={(e) => setNewResinDetails(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
                  Publish Craft Item to Storefront
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: IMAGE UPLOAD */}
        {isImageUploadOpen && (
          <div className="modal-overlay" onClick={() => setIsImageUploadOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
              <button onClick={() => setIsImageUploadOpen(false)} className="btn-icon" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <X size={18} />
              </button>
              <Upload size={36} color="var(--color-terracotta)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Upload New Craft Image</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '20px' }}>
                Select a high-resolution photo of your handcrafted item from your computer.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ width: '100%', padding: '10px', background: 'var(--color-cream)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
