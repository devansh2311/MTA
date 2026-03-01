import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
    HiOutlineTrendingUp, HiOutlineShoppingBag, HiOutlineCurrencyRupee,
    HiOutlineUserGroup, HiOutlineCollection, HiOutlineClock, HiOutlineCheckCircle,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI, authAPI, contactAPI } from '../services/api';
import { LoadingSpinner } from '../components/Common';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusColors = {
    pending: { bg: '#FEF3C7', color: '#D97706' },
    confirmed: { bg: '#DBEAFE', color: '#2563EB' },
    processing: { bg: '#EDE9FE', color: '#7C3AED' },
    shipped: { bg: '#CFFAFE', color: '#0891B2' },
    delivered: { bg: '#D1FAE5', color: '#059669' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626' },
    completed: { bg: '#D1FAE5', color: '#059669' },
    failed: { bg: '#FEE2E2', color: '#DC2626' },
    refunded: { bg: '#FEF3C7', color: '#D97706' },
};

function Badge({ status }) {
    const s = statusColors[status] || { bg: '#F3F4F6', color: '#6B7280' };
    return (
        <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
            fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize',
            letterSpacing: '0.04em', background: s.bg, color: s.color,
        }}>{status}</span>
    );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, loading }) {
    if (loading) return <LoadingSpinner size="md" text="Loading stats..." />;

    const cards = [
        { label: 'Total Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN')}`, icon: <HiOutlineCurrencyRupee size={22} />, color: '#C5653A', bg: '#FEF0EB' },
        { label: 'Total Orders', value: stats?.total_orders || 0, icon: <HiOutlineShoppingBag size={22} />, color: '#2563EB', bg: '#DBEAFE' },
        { label: 'Products Listed', value: stats?.total_products || 0, icon: <HiOutlineCollection size={22} />, color: '#7C3AED', bg: '#EDE9FE' },
        { label: 'Customers', value: stats?.total_customers || 0, icon: <HiOutlineUserGroup size={22} />, color: '#059669', bg: '#D1FAE5' },
        { label: 'Delivered Revenue', value: `₹${Number(stats?.delivered_revenue || 0).toLocaleString('en-IN')}`, icon: <HiOutlineCheckCircle size={22} />, color: '#059669', bg: '#D1FAE5' },
        { label: 'Pending Orders', value: stats?.pending_orders || 0, icon: <HiOutlineClock size={22} />, color: '#D97706', bg: '#FEF3C7' },
    ];

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 24px', color: 'var(--clr-text)' }}>Dashboard Overview</h2>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {cards.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="card" style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {c.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--clr-text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0 }}>{c.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            {stats?.recent_orders?.length > 0 && (
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: '0 0 16px' }}>Recent Orders</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--clr-border)' }}>
                                {['Order #', 'Customer', 'Amount', 'Status', 'Payment', 'Date'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_orders.map(o => (
                                <tr key={o.id} style={{ borderBottom: '1px solid var(--clr-border-light)' }}>
                                    <td style={{ padding: '10px' }}><span style={{ fontWeight: 600 }}>#{o.order_number}</span></td>
                                    <td style={{ padding: '10px', color: 'var(--clr-text-secondary)' }}>{o.shipping_name}</td>
                                    <td style={{ padding: '10px', fontWeight: 600 }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '10px' }}><Badge status={o.status} /></td>
                                    <td style={{ padding: '10px' }}><Badge status={o.payment_status} /></td>
                                    <td style={{ padding: '10px', color: 'var(--clr-text-muted)' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const emptyForm = {
        name: '', description: '', short_description: '', price: '',
        discount_price: '', category: '', stock: '', material: 'cotton',
        weave_type: '', origin: '', is_featured: false,
        return_policy: 'no_return', replacement_allowed: false,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        (async () => {
            try {
                const [pRes, cRes] = await Promise.all([productsAPI.getOwnerProducts(), productsAPI.getCategories()]);
                setProducts(pRes.data.results || pRes.data);
                setCategories(cRes.data);
            } catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    const loadImages = async (productId) => {
        try {
            const pRes = await productsAPI.getOwnerProducts();
            const all = pRes.data.results || pRes.data;
            const target = all.find(p => p.id === productId);
            if (target) {
                const dRes = await productsAPI.getBySlug(target.slug);
                setProductImages(dRes.data.images || []);
            }
        } catch (e) { console.error(e); }
    };

    const refreshProducts = async () => {
        const res = await productsAPI.getOwnerProducts();
        setProducts(res.data.results || res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), category: parseInt(form.category) };
            if (data.discount_price) data.discount_price = parseFloat(data.discount_price); else delete data.discount_price;
            let saved;
            if (editingProduct) {
                saved = await productsAPI.updateProduct(editingProduct.id, data);
                toast.success('Product updated!');
                setCurrentProductId(editingProduct.id);
                await loadImages(editingProduct.id);
            } else {
                saved = await productsAPI.createProduct(data);
                toast.success('Product created! Now add images below.');
                setCurrentProductId(saved.data.id);
            }
            await refreshProducts();
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to save product'); }
    };

    const handleUploadImages = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !currentProductId) return;
        setUploadingImages(true);
        for (const file of files) {
            const fd = new FormData(); fd.append('image', file); fd.append('alt_text', file.name);
            await productsAPI.uploadImage(currentProductId, fd);
        }
        toast.success(`${files.length} image(s) uploaded!`);
        await loadImages(currentProductId); await refreshProducts();
        setUploadingImages(false); e.target.value = '';
    };

    const handleDeleteImage = async (id) => {
        await productsAPI.deleteImage(id);
        setProductImages(p => p.filter(i => i.id !== id));
        toast.success('Image deleted'); await refreshProducts();
    };

    const handleSetPrimary = async (id) => {
        await productsAPI.setImagePrimary(id);
        setProductImages(p => p.map(i => ({ ...i, is_primary: i.id === id })));
        toast.success('Hero image set!'); await refreshProducts();
    };

    const handleEdit = (p) => {
        setForm({ name: p.name, description: p.description || '', short_description: p.short_description || '', price: p.price, discount_price: p.discount_price || '', category: p.category, stock: p.stock, material: p.material || 'cotton', weave_type: p.weave_type || '', origin: p.origin || '', is_featured: p.is_featured, return_policy: p.return_policy || 'no_return', replacement_allowed: p.replacement_allowed || false });
        setEditingProduct(p); setCurrentProductId(p.id); setShowForm(true); loadImages(p.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await productsAPI.deleteProduct(id);
        setProducts(p => p.filter(x => x.id !== id)); toast.success('Product deleted!');
    };

    const closeForm = () => { setShowForm(false); setEditingProduct(null); setForm(emptyForm); setProductImages([]); setCurrentProductId(null); };

    if (loading) return <LoadingSpinner size="md" />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>My Products <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--clr-text-muted)' }}>({products.length})</span></h2>
                {!showForm && <button onClick={() => { setShowForm(true); setEditingProduct(null); setForm(emptyForm); setProductImages([]); setCurrentProductId(null); }} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HiOutlinePlus size={16} /> Add Product
                </button>}
            </div>

            {showForm && (
                <div className="card" style={{ padding: '32px', marginBottom: '24px', maxWidth: '640px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', margin: '0 0 24px' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Product Name *</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Description *</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows="3" required></textarea>
                            </div>
                            <div>
                                <label style={labelStyle}>Price (₹) *</label>
                                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label style={labelStyle}>Discount Price</label>
                                <input type="number" step="0.01" value={form.discount_price} onChange={e => setForm({ ...form, discount_price: e.target.value })} className="input-field" />
                            </div>
                            <div>
                                <label style={labelStyle}>Category *</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field" required>
                                    <option value="">Select</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Stock *</label>
                                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label style={labelStyle}>Material</label>
                                <select value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="input-field">
                                    {['cotton', 'silk', 'wool', 'jute', 'linen', 'blend', 'other'].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Origin</label>
                                <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} className="input-field" placeholder="e.g. Varanasi" />
                            </div>
                            <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--clr-border-light)', paddingTop: '16px', marginTop: '4px' }}>
                                <label style={{ ...labelStyle, marginBottom: '12px', display: 'block' }}>Return &amp; Replacement Policy</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ ...labelStyle, fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>Return Window</label>
                                        <select value={form.return_policy} onChange={e => setForm({ ...form, return_policy: e.target.value })} className="input-field">
                                            <option value="no_return">No Return Policy</option>
                                            <option value="7_days">7-Day Return</option>
                                            <option value="10_days">10-Day Return</option>
                                            <option value="15_days">15-Day Return</option>
                                            <option value="30_days">30-Day Return</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                                        <input type="checkbox" id="replallowed" checked={form.replacement_allowed} onChange={e => setForm({ ...form, replacement_allowed: e.target.checked })} />
                                        <label htmlFor="replallowed" style={{ fontSize: '0.82rem', color: 'var(--clr-text)' }}>Replacement Allowed</label>
                                    </div>
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <input type="checkbox" id="feat" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                                <label htmlFor="feat" style={{ fontSize: '0.82rem', color: 'var(--clr-text)' }}>Featured Product</label>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: currentProductId ? '32px' : '0' }}>
                            <button type="submit" className="btn-secondary">{editingProduct ? 'Update Product' : 'Save & Continue to Images'}</button>
                            <button type="button" onClick={closeForm} className="btn-outline">Cancel</button>
                        </div>
                    </form>

                    {currentProductId && (
                        <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '28px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>Product Images</h4>
                            <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', margin: '0 0 16px' }}>Upload images and click ⭐ to set the hero image shown on listings.</p>
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px', border: '2px dashed var(--clr-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '16px', color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>
                                <HiOutlinePlus size={18} />
                                {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                                <input type="file" multiple accept="image/*" onChange={handleUploadImages} style={{ display: 'none' }} disabled={uploadingImages} />
                            </label>
                            {productImages.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                                    {productImages.map(img => (
                                        <div key={img.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: img.is_primary ? '3px solid var(--clr-gold)' : '2px solid var(--clr-border)' }}>
                                            <img src={img.image} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} onError={e => e.target.src = 'https://placehold.co/110x110/FAF7F2/C4653A?text=Img'} />
                                            {img.is_primary && <span style={{ position: 'absolute', top: '5px', left: '5px', background: 'var(--clr-gold)', color: '#fff', fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' }}>HERO</span>}
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.65)', padding: '4px' }}>
                                                <button onClick={() => handleSetPrimary(img.id)} style={{ flex: 1, padding: '5px', fontSize: '0.65rem', border: 'none', borderRadius: '4px', background: img.is_primary ? 'var(--clr-gold)' : 'rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>⭐</button>
                                                <button onClick={() => handleDeleteImage(img.id)} style={{ padding: '5px 7px', border: 'none', borderRadius: '4px', background: 'rgba(220,38,38,0.85)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>🗑</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {products.length === 0 && !showForm ? (
                <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--clr-text-muted)', margin: '0 0 16px' }}>No products yet.</p>
                    <button onClick={() => setShowForm(true)} className="btn-secondary" style={{ fontSize: '0.82rem' }}>Add Your First Product</button>
                </div>
            ) : (
                <div>
                    {products.map(p => (
                        <div key={p.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                            <img src={p.primary_image || `https://placehold.co/52x52/FAF7F2/C4653A?text=${p.name?.charAt(0)}`} alt={p.name}
                                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                onError={e => e.target.src = 'https://placehold.co/52x52/FAF7F2/C4653A?text=P'} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', margin: 0 }}>Stock: {p.stock} · {p.material}</p>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0 }}>₹{Number(p.effective_price).toLocaleString('en-IN')}</p>
                                {p.discount_price && <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', margin: 0, textDecoration: 'line-through' }}>₹{Number(p.price).toLocaleString('en-IN')}</p>}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                <button onClick={() => handleEdit(p)} style={iconBtn('#C5653A')}>
                                    <HiOutlinePencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(p.id)} style={iconBtn('#DC2626', '#FEE2E2')}>
                                    <HiOutlineTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await ordersAPI.getOwnerOrders();
                setOrders(res.data.results || res.data);
            } catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await ordersAPI.updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            toast.success('Status updated!');
        } catch { toast.error('Failed to update'); }
    };

    if (loading) return <LoadingSpinner size="md" />;

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 24px' }}>
                Received Orders <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--clr-text-muted)' }}>({orders.length})</span>
            </h2>
            {orders.length === 0 ? (
                <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--clr-text-muted)' }}>No orders received yet.</p>
                </div>
            ) : orders.map(order => (
                <div key={order.id} className="card" style={{ marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text)' }}>#{order.order_number}</span>
                                <Badge status={order.status} />
                                <Badge status={order.payment_status} />
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', margin: 0 }}>
                                {order.shipping_name} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0, flexShrink: 0 }}>
                            ₹{Number(order.total_amount).toLocaleString('en-IN')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select value={order.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(order.id, e.target.value)}
                                style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>
                    {expandedOrder === order.id && (
                        <div style={{ borderTop: '1px solid var(--clr-border-light)', padding: '20px', background: 'var(--clr-bg)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Shipping Address</p>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--clr-text)', margin: '0 0 2px', fontWeight: 600 }}>{order.shipping_name}</p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', margin: 0 }}>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', margin: '4px 0 0' }}>📞 {order.shipping_phone}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Order Info</p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', margin: '0 0 4px' }}>Total: <strong>₹{Number(order.total_amount).toLocaleString('en-IN')}</strong></p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary)', margin: '0 0 4px' }}>Payment: <Badge status={order.payment_status} /></p>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Items Ordered</p>
                            {(order.items || []).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--clr-border-light)', fontSize: '0.82rem' }}>
                                    <span style={{ color: 'var(--clr-text)' }}>{item.product_name} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600 }}>₹{Number(item.subtotal || item.product_price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────
function CustomersTab() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await ordersAPI.getOwnerCustomers();
                setCustomers(res.data);
            } catch (e) { console.error(e); }
            setLoading(false);
        })();
    }, []);

    if (loading) return <LoadingSpinner size="md" />;

    return (
        <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 24px' }}>
                Customers <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--clr-text-muted)' }}>({customers.length})</span>
            </h2>
            {customers.length === 0 ? (
                <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--clr-text-muted)' }}>No customers yet. Share your products to get orders!</p>
                </div>
            ) : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--clr-bg)', borderBottom: '2px solid var(--clr-border)' }}>
                                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order', 'Status'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--clr-border-light)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-bg)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--clr-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                                                {c.name?.charAt(0) || 'C'}
                                            </div>
                                            <span style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: 'var(--clr-text-secondary)' }}>{c.email}</td>
                                    <td style={{ padding: '14px 16px', color: 'var(--clr-text-secondary)' }}>{c.phone}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--clr-text)', textAlign: 'center' }}>{c.order_count}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--clr-accent)' }}>₹{Number(c.total_spend).toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '14px 16px', color: 'var(--clr-text-muted)' }}>{c.last_order_date}</td>
                                    <td style={{ padding: '14px 16px' }}><Badge status={c.last_order_status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Shop Settings Tab ────────────────────────────────────────────────────────
function ShopSettingsTab() {
    const { user, refreshUser } = useAuth();
    const [profileForm, setProfileForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
    const [shopForm, setShopForm] = useState({ shop_name: '', shop_description: '', shop_address: '', shop_phone: '', gst_number: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setProfileForm({
            first_name: user?.first_name || '', last_name: user?.last_name || '',
            email: user?.email || '', phone: user?.phone || '',
        });
        if (user?.owner_profile) {
            setShopForm({
                shop_name: user.owner_profile.shop_name || '',
                shop_description: user.owner_profile.shop_description || '',
                shop_address: user.owner_profile.shop_address || '',
                shop_phone: user.owner_profile.shop_phone || '',
                gst_number: user.owner_profile.gst_number || '',
            });
        }
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            await authAPI.updateProfile(profileForm);
            if (refreshUser) await refreshUser();
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update profile'); }
        setSaving(false);
    };

    const handleSaveShop = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            await authAPI.updateOwnerProfile(shopForm);
            if (refreshUser) await refreshUser();
            toast.success('Shop updated!');
        } catch { toast.error('Failed to update shop settings'); }
        setSaving(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Personal Info */}
            <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: '0 0 20px' }}>Personal Information</h3>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>First Name</label>
                            <input value={profileForm.first_name} onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <label style={labelStyle}>Last Name</label>
                            <input value={profileForm.last_name} onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone Number</label>
                        <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
                    </div>
                    <button type="submit" className="btn-secondary" disabled={saving} style={{ marginTop: '8px' }}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* Shop Info */}
            <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: '0 0 20px' }}>Shop Details</h3>
                <form onSubmit={handleSaveShop} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label style={labelStyle}>Shop Name</label>
                        <input value={shopForm.shop_name} onChange={e => setShopForm({ ...shopForm, shop_name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea value={shopForm.shop_description} onChange={e => setShopForm({ ...shopForm, shop_description: e.target.value })} className="input-field" rows="3"></textarea>
                    </div>
                    <div>
                        <label style={labelStyle}>Shop Address</label>
                        <textarea value={shopForm.shop_address} onChange={e => setShopForm({ ...shopForm, shop_address: e.target.value })} className="input-field" rows="2" placeholder="e.g. 123 Main St, Varanasi, UP"></textarea>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={labelStyle}>Shop Phone</label>
                            <input type="tel" value={shopForm.shop_phone} onChange={e => setShopForm({ ...shopForm, shop_phone: e.target.value })} className="input-field" placeholder="e.g. +91 98765 43210" />
                        </div>
                        <div>
                            <label style={labelStyle}>GST Number</label>
                            <input value={shopForm.gst_number} onChange={e => setShopForm({ ...shopForm, gst_number: e.target.value })} className="input-field" placeholder="e.g. 22AAAAA0000A1Z5" />
                        </div>
                    </div>
                    <button type="submit" className="btn-secondary" disabled={saving} style={{ marginTop: '8px' }}>
                        {saving ? 'Saving...' : 'Save Shop Details'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMsg, setExpandedMsg] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await contactAPI.getOwnerMessages();
                const data = res.data;
                setMessages(Array.isArray(data) ? data : (data.results || []));
            } catch (err) {
                toast.error('Failed to fetch messages');
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) return <LoadingSpinner size="md" text="Loading messages..." />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0, color: 'var(--clr-text)' }}>
                    Customer Messages <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--clr-text-muted)' }}>({messages.length})</span>
                </h2>
            </div>

            {messages.length === 0 ? (
                <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--clr-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
                        📬
                    </div>
                    <p style={{ color: 'var(--clr-text-muted)', margin: 0 }}>No messages yet. Customer inquiries from the Contact Us page will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((msg, i) => {
                        const isExpanded = expandedMsg === (msg.id || i);
                        return (
                            <motion.div
                                key={msg.id || i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="card"
                                style={{ overflow: 'hidden' }}
                            >
                                {/* Header row - clickable */}
                                <div
                                    onClick={() => setExpandedMsg(isExpanded ? null : (msg.id || i))}
                                    style={{
                                        padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px',
                                        cursor: 'pointer', transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-bg)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--clr-accent), #D4A017)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0
                                    }}>
                                        {msg.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--clr-text)' }}>{msg.name}</span>
                                            {msg.subject && (
                                                <span style={{
                                                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px',
                                                    background: 'var(--clr-bg)', color: 'var(--clr-text-muted)', fontWeight: 500,
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px'
                                                }}>
                                                    {msg.subject}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--clr-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {isExpanded ? msg.email : msg.message}
                                        </p>
                                    </div>

                                    {/* Date */}
                                    <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short'
                                        }) : ''}
                                    </span>
                                </div>

                                {/* Expanded content */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--clr-border-light)', padding: '20px 22px', background: 'var(--clr-bg)' }}>
                                        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                            <div>
                                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Email</p>
                                                <a href={`mailto:${msg.email}`} style={{ fontSize: '0.85rem', color: 'var(--clr-accent)', textDecoration: 'none' }}>{msg.email}</a>
                                            </div>
                                            {msg.phone && (
                                                <div>
                                                    <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Phone</p>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--clr-text)' }}>{msg.phone}</span>
                                                </div>
                                            )}
                                            <div>
                                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Date</p>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--clr-text)' }}>
                                                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    }) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        {msg.subject && (
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 8px' }}>Re: {msg.subject}</p>
                                        )}
                                        <div style={{ padding: '16px', background: 'var(--clr-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border-light)' }}>
                                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--clr-text)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Style helpers ─────────────────────────────────────────────────────────────
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '6px' };
const iconBtn = (color, bg = 'var(--clr-bg)') => ({
    width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: bg, color, transition: 'all 0.2s',
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await ordersAPI.getOwnerStats();
                setStats(res.data);
            } catch (e) { console.error(e); }
            setStatsLoading(false);
        })();
    }, []);

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Page Header */}
            <div style={{ background: 'linear-gradient(135deg, #1B1212 0%, #2C1B0E 100%)', padding: '32px 0' }}>
                <div className="container">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#fff', margin: '0 0 4px' }}>
                        {user?.owner_profile?.shop_name || 'My Shop'}
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Welcome back, {user?.first_name} 👋</p>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '32px' }}>
                {activeTab === 'overview' && <OverviewTab stats={stats} loading={statsLoading} />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'customers' && <CustomersTab />}
                {activeTab === 'messages' && <MessagesTab />}
                {activeTab === 'settings' && <ShopSettingsTab />}
            </div>
        </div>
    );
}
