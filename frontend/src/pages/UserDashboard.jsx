import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineShoppingBag, HiOutlineHeart, HiOutlineCog, HiOutlineClipboardList, HiOutlineX,
    HiOutlineClipboardCheck, HiOutlineCheckCircle, HiOutlineCog as HiCogIcon, HiOutlineTruck, HiOutlineCube, HiOutlineBan
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, cartAPI, authAPI } from '../services/api';
import { LoadingSpinner } from '../components/Common';
import toast from 'react-hot-toast';

// ─── Order Timeline ───────────────────────────────────────────────────────────
const ORDER_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: HiOutlineClipboardCheck, desc: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: HiOutlineCheckCircle, desc: 'Payment verified, order confirmed' },
    { key: 'processing', label: 'Processing', icon: HiCogIcon, desc: 'Being prepared for shipment' },
    { key: 'shipped', label: 'Shipped', icon: HiOutlineTruck, desc: 'On the way to your address' },
    { key: 'delivered', label: 'Delivered', icon: HiOutlineCube, desc: 'Successfully delivered!' },
];

function OrderTimeline({ status, createdAt, updatedAt }) {
    const isCancelled = status === 'cancelled';
    const currentIdx = ORDER_STEPS.findIndex(s => s.key === status);
    const activeIdx = isCancelled ? -1 : currentIdx;

    const orderDate = new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const updateDate = updatedAt ? new Date(updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

    return (
        <div style={{ margin: '0 0 32px', padding: '24px', background: 'var(--clr-bg)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', margin: '0 0 20px', fontWeight: 600 }}>
                Order Tracking
            </p>

            {isCancelled && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#FEE2E2', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <HiOutlineBan size={20} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#991B1B', margin: '0 0 2px' }}>Order Cancelled</p>
                        <p style={{ fontSize: '0.78rem', color: '#B91C1C', margin: 0 }}>
                            This order was cancelled{updateDate ? ` on ${updateDate}` : ''}.
                        </p>
                    </div>
                </motion.div>
            )}

            {!isCancelled && (
                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    {ORDER_STEPS.map((step, i) => {
                        const isCompleted = i <= activeIdx;
                        const isCurrent = i === activeIdx;
                        const isFuture = i > activeIdx;
                        const StepIcon = step.icon;

                        const circleColor = isCompleted ? 'var(--clr-accent)' : 'var(--clr-border)';
                        const lineColor = (i < activeIdx) ? 'var(--clr-accent)' : 'var(--clr-border-light)';

                        let dateLabel = '';
                        if (i === 0) dateLabel = orderDate;
                        else if (isCurrent && updateDate) dateLabel = updateDate;

                        return (
                            <motion.div
                                key={step.key}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                style={{ position: 'relative', paddingBottom: i < ORDER_STEPS.length - 1 ? '28px' : '0', display: 'flex', gap: '16px' }}
                            >
                                {/* Vertical connector line */}
                                {i < ORDER_STEPS.length - 1 && (
                                    <div style={{
                                        position: 'absolute', left: '-17px', top: '36px',
                                        width: '2px', height: 'calc(100% - 28px)',
                                        background: lineColor, transition: 'background 0.3s',
                                    }} />
                                )}

                                {/* Step circle */}
                                <div style={{
                                    position: 'absolute', left: '-28px',
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: isCompleted ? circleColor : 'var(--clr-surface)',
                                    border: `2px solid ${circleColor}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    boxShadow: isCurrent ? `0 0 0 4px rgba(197, 101, 58, 0.2)` : 'none',
                                    zIndex: 1,
                                }}>
                                    <StepIcon size={12} style={{ color: isCompleted ? '#fff' : 'var(--clr-text-muted)' }} />
                                </div>

                                {/* Step content */}
                                <div style={{ flex: 1, minHeight: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: isCompleted ? 600 : 400,
                                            color: isFuture ? 'var(--clr-text-muted)' : 'var(--clr-text)',
                                        }}>
                                            {step.label}
                                        </span>
                                        {isCurrent && (
                                            <span style={{
                                                fontSize: '0.62rem', padding: '2px 8px', borderRadius: '999px',
                                                background: 'rgba(197, 101, 58, 0.15)', color: 'var(--clr-accent)', fontWeight: 700,
                                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                            }}>
                                                Current
                                            </span>
                                        )}
                                        {dateLabel && (
                                            <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginLeft: 'auto' }}>
                                                {dateLabel}
                                            </span>
                                        )}
                                    </div>
                                    {(isCompleted || isCurrent) && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: '2px 0 0' }}>{step.desc}</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function UserDashboard() {
    const { user, updateUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({
        first_name: user?.first_name || '', last_name: user?.last_name || '',
        phone: user?.phone || '', address: user?.address || '',
        city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '',
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, wishlistRes] = await Promise.all([ordersAPI.getOrders(), cartAPI.getWishlist()]);
                setOrders(ordersRes.data.results || ordersRes.data);
                setWishlist(wishlistRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try { const res = await authAPI.updateProfile(profileForm); updateUser(res.data); toast.success('Profile updated!'); }
        catch { toast.error('Failed to update'); }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <HiOutlineClipboardList size={18} /> },
        { id: 'orders', label: 'Orders', icon: <HiOutlineShoppingBag size={18} /> },
        { id: 'wishlist', label: 'Wishlist', icon: <HiOutlineHeart size={18} /> },
        { id: 'settings', label: 'Settings', icon: <HiOutlineCog size={18} /> },
    ];

    if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '70vh' }}>
            <div style={{ background: 'linear-gradient(160deg, #2C2C2C 0%, #1a1a1a 50%, #3D2B1F 100%)', padding: '48px 0' }}>
                <div className="container">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#fff', margin: '0 0 6px' }}>Welcome, {user?.first_name || user?.username}!</h1>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Manage your account, orders, and wishlist</p>
                </div>
            </div>

            <div className="container" style={{ padding: '36px var(--space-lg) 80px' }}>
                <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
                    {/* Sidebar */}
                    <div style={{ width: '220px', flexShrink: 0 }}>
                        <div className="card" style={{ padding: '12px', position: 'sticky', top: '96px' }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                                    fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400,
                                    fontFamily: 'var(--font-body)',
                                    background: activeTab === tab.id ? 'var(--clr-accent)' : 'transparent',
                                    color: activeTab === tab.id ? '#fff' : 'var(--clr-text-secondary)',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '2px',
                                }}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {activeTab === 'overview' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                                {[
                                    { val: orders.length, label: 'Total Orders', color: 'var(--clr-accent)' },
                                    { val: wishlist.length, label: 'Wishlist Items', color: 'var(--clr-gold)' },
                                    { val: orders.filter(o => o.status === 'delivered').length, label: 'Delivered', color: 'var(--clr-sage)' },
                                ].map((s, i) => (
                                    <div key={i} className="card" style={{ padding: '28px', textAlign: 'center' }}>
                                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: s.color, margin: '0 0 4px' }}>{s.val}</p>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', margin: 0 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 20px', color: 'var(--clr-text)' }}>My Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--clr-text-muted)', margin: '0 0 20px' }}>No orders yet.</p>
                                        <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none' }}>Shop Now</Link>
                                    </div>
                                ) : orders.map(order => (
                                    <div key={order.id} className="card" onClick={() => setSelectedOrder(order)}
                                        style={{ padding: '20px', marginBottom: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>Order #{order.order_number}</p>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', margin: 0 }}>{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                                            </div>
                                            <span className={`badge badge-${order.status}`}>{order.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', margin: 0 }}>{order.items?.length || 0} items</p>
                                            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0 }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 20px', color: 'var(--clr-text)' }}>My Wishlist</h2>
                                {wishlist.length === 0 ? (
                                    <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--clr-text-muted)' }}>Your wishlist is empty.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                                        {wishlist.map(item => (
                                            <Link to={`/products/${item.product_detail?.slug}`} key={item.id} className="card" style={{ padding: '16px', display: 'flex', gap: '14px', textDecoration: 'none', color: 'inherit' }}>
                                                <img src={item.product_detail?.primary_image || 'https://placehold.co/80x100/FAF7F2/C4653A?text=P'} alt="" style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                                <div>
                                                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 6px' }}>{item.product_detail?.name}</h4>
                                                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--clr-accent)', margin: 0 }}>₹{Number(item.product_detail?.effective_price).toLocaleString('en-IN')}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="card" style={{ padding: '32px', maxWidth: '480px' }}>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 24px', color: 'var(--clr-text)' }}>Profile Settings</h2>
                                <form onSubmit={handleUpdateProfile}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>First Name</label>
                                            <input value={profileForm.first_name} onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })} className="input-field" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Last Name</label>
                                            <input value={profileForm.last_name} onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })} className="input-field" />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Phone</label>
                                        <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Address</label>
                                        <textarea value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="input-field" rows="2"></textarea>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>City</label>
                                            <input value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} className="input-field" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>State</label>
                                            <input value={profileForm.state} onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })} className="input-field" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Pincode</label>
                                            <input value={profileForm.pincode} onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })} className="input-field" />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-secondary">Save Changes</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '20px'
                }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px',
                            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
                        }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--clr-surface)', zIndex: 1 }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 4px', color: 'var(--clr-text)' }}>Order #{selectedOrder.order_number}</h2>
                                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', margin: 0 }}>Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')} at {new Date(selectedOrder.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'var(--clr-bg)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--clr-text-secondary)' }}>
                                <HiOutlineX size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '32px' }}>
                            {/* Order Timeline */}
                            <OrderTimeline status={selectedOrder.status} createdAt={selectedOrder.created_at} updatedAt={selectedOrder.updated_at} />

                            {/* Payment Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', padding: '16px 20px', background: 'var(--clr-bg)', borderRadius: 'var(--radius-md)' }}>
                                <div>
                                    <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', margin: '0 0 4px', fontWeight: 600 }}>Payment</p>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedOrder.payment_status === 'completed' ? '#059669' : selectedOrder.payment_status === 'failed' ? '#DC2626' : 'var(--clr-text)' }}>
                                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                                    </span>
                                </div>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--clr-accent)', margin: 0 }}>₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p>
                            </div>

                            {/* Items List */}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 16px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '12px' }}>Items Ordered</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                {selectedOrder.items?.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', background: 'var(--clr-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📦</div>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 4px' }}>{item.product_name}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', margin: 0 }}>Qty: {item.quantity} × ₹{Number(item.product_price).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Details */}
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 16px', borderBottom: '1px solid var(--clr-border)', paddingBottom: '12px' }}>Shipping Details</h3>
                            <div style={{ background: 'var(--clr-bg)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 8px' }}>{selectedOrder.shipping_name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)', margin: '0 0 4px' }}>{selectedOrder.shipping_address}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)', margin: '0 0 12px' }}>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_pincode}</p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                                    <span>📞 {selectedOrder.shipping_phone}</span>
                                    <span>✉️ {selectedOrder.shipping_email}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
