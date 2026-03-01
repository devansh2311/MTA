import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Check if we arrived via "Buy Now" for a single item
    const buyNowItem = location.state?.buyNowItem;
    const [form, setForm] = useState({
        shipping_name: user?.first_name ? `${user.first_name} ${user.last_name}` : '',
        shipping_email: user?.email || '',
        shipping_phone: user?.phone || '',
        shipping_address: user?.address || '',
        shipping_city: user?.city || '',
        shipping_state: user?.state || '',
        shipping_pincode: user?.pincode || '',
    });

    // Use Buy Now item details if present, otherwise fallback to Cart
    let subtotal = cartTotal;
    let checkoutItems = cart?.items || [];

    if (buyNowItem) {
        subtotal = (buyNowItem.product.discount_price || buyNowItem.product.price) * buyNowItem.quantity;
        checkoutItems = [{
            id: 'buynow',
            product: buyNowItem.product.id,
            product_detail: {
                name: buyNowItem.product.name,
                effective_price: buyNowItem.product.discount_price || buyNowItem.product.price
            },
            quantity: buyNowItem.quantity
        }];
    }

    const shippingCost = subtotal > 2999 ? 0 : 149;
    const totalAmount = subtotal + shippingCost;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiItems = buyNowItem
                ? [{ product: buyNowItem.product.id, quantity: buyNowItem.quantity }]
                : (cart?.items || []).map(i => ({ product: i.product, quantity: i.quantity }));

            await ordersAPI.createOrder({ items: apiItems, ...form });
            toast.success('Order placed successfully!');

            // Only clear the cart if we checked out the actual cart
            if (!buyNowItem) {
                clearCart();
            }
            navigate('/order-confirmation', { state: { orderSuccess: true, totalAmount } });
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to place order');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '70vh' }}>
            <div className="container" style={{ padding: '48px var(--space-lg) 80px', maxWidth: '800px' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: '0 0 36px', textAlign: 'center' }}>Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Shipping Info */}
                        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 24px', color: 'var(--clr-text)' }}>Shipping Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Full Name</label>
                                    <input value={form.shipping_name} onChange={(e) => setForm({ ...form, shipping_name: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Phone</label>
                                    <input value={form.shipping_phone} onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })} className="input-field" required />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Email</label>
                                    <input type="email" value={form.shipping_email} onChange={(e) => setForm({ ...form, shipping_email: e.target.value })} className="input-field" required />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Address</label>
                                    <textarea value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} className="input-field" rows="2" required></textarea>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>City</label>
                                    <input value={form.shipping_city} onChange={(e) => setForm({ ...form, shipping_city: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>State</label>
                                    <input value={form.shipping_state} onChange={(e) => setForm({ ...form, shipping_state: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Pincode</label>
                                    <input value={form.shipping_pincode} onChange={(e) => setForm({ ...form, shipping_pincode: e.target.value })} className="input-field" required />
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 20px', color: 'var(--clr-text)' }}>Order Summary {buyNowItem && '(Buy Now)'}</h2>
                            {checkoutItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--clr-text-secondary)' }}>{item.product_detail?.name} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--clr-text)' }}>₹{(Number(item.product_detail?.effective_price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--clr-border-light)', paddingTop: '12px', marginTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--clr-text-secondary)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--clr-text-secondary)' }}>Shipping</span>
                                    <span style={{ fontWeight: 600, color: shippingCost === 0 ? 'var(--clr-success)' : 'var(--clr-text)' }}>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--clr-border-light)' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total</span>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading || !checkoutItems.length} className="btn-secondary" style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}>
                            <HiOutlineShieldCheck size={18} /> {loading ? 'Processing...' : `Place Order · ₹${totalAmount.toLocaleString('en-IN')}`}
                        </button>
                        <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', textAlign: 'center', marginTop: '12px' }}>
                            🔒 Your information is secured with 256-bit encryption
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
