import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMinus, HiPlus, HiOutlineTrash, HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, EmptyState } from '../components/Common';

export default function CartPage() {
    const { cart, loading, updateCartItem, removeCartItem, clearCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const shippingCost = cartTotal > 2999 ? 0 : 149;
    const totalAmount = cartTotal + shippingCost;

    if (loading) return <LoadingSpinner size="lg" text="Loading cart..." />;

    if (!isAuthenticated) {
        return (
            <div style={{ background: 'var(--clr-bg)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
                    <HiOutlineShoppingBag size={48} style={{ color: 'var(--clr-text-muted)', margin: '0 auto 20px' }} />
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 8px', color: 'var(--clr-text)' }}>Sign In Required</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: '0 0 24px' }}>Please sign in to view your cart.</p>
                    <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        );
    }

    const cartItems = cart?.items || [];

    if (cartItems.length === 0) {
        return (
            <div style={{ background: 'var(--clr-bg)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
                    <HiOutlineShoppingBag size={48} style={{ color: 'var(--clr-text-muted)', margin: '0 auto 20px' }} />
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 8px', color: 'var(--clr-text)' }}>Your Cart is Empty</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: '0 0 24px' }}>Start exploring our premium home textile collection.</p>
                    <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none' }}>Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '70vh' }}>
            <div className="container" style={{ padding: '48px var(--space-lg) 80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: 0 }}>Shopping Cart</h1>
                    <button onClick={() => clearCart()} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--clr-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
                    }}>Clear Cart</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                    {/* For larger screens, we'd use lg:grid-cols-3 but inline styles need a different approach */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cartItems.map((item, i) => (
                                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <Link to={`/products/${item.product_detail?.slug}`}>
                                        <img
                                            src={item.product_detail?.primary_image || `https://placehold.co/100x120/FAF7F2/C4653A?text=${item.product_detail?.name?.charAt(0) || 'P'}`}
                                            alt={item.product_detail?.name}
                                            style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                                            onError={(e) => { e.target.src = 'https://placehold.co/100x120/FAF7F2/C4653A?text=P'; }}
                                        />
                                    </Link>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link to={`/products/${item.product_detail?.slug}`} style={{ textDecoration: 'none' }}>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 4px' }}>{item.product_detail?.name}</h3>
                                        </Link>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: '0 0 12px' }}>{item.product_detail?.category_name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                <button onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-secondary)' }}>
                                                    <HiMinus size={14} />
                                                </button>
                                                <span style={{ width: '36px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        const stock = item.product_detail?.stock ?? 9999;
                                                        if (item.quantity < stock) updateCartItem(item.id, item.quantity + 1);
                                                    }}
                                                    disabled={item.quantity >= (item.product_detail?.stock ?? 9999)}
                                                    title={item.quantity >= (item.product_detail?.stock ?? 9999) ? `Only ${item.product_detail?.stock} in stock` : 'Add more'}
                                                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: item.quantity >= (item.product_detail?.stock ?? 9999) ? 'not-allowed' : 'pointer', color: item.quantity >= (item.product_detail?.stock ?? 9999) ? 'var(--clr-border)' : 'var(--clr-text-secondary)', opacity: item.quantity >= (item.product_detail?.stock ?? 9999) ? 0.5 : 1 }}>
                                                    <HiPlus size={14} />
                                                </button>
                                            </div>
                                            {item.quantity >= (item.product_detail?.stock ?? 9999) && (
                                                <span style={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 600 }}>
                                                    Only {item.product_detail?.stock} left!
                                                </span>
                                            )}
                                            <button onClick={() => removeCartItem(item.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-error)', display: 'flex', padding: '6px' }}>
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0, flexShrink: 0 }}>
                                        ₹{(Number(item.product_detail?.effective_price || 0) * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary Card */}
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 20px', color: 'var(--clr-text)' }}>Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)' }}>Subtotal</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)' }}>Shipping</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: shippingCost === 0 ? 'var(--clr-success)' : 'var(--clr-text)' }}>
                                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                                </span>
                            </div>
                            <div style={{ borderTop: '1px solid var(--clr-border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--clr-text)' }}>Total</span>
                                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--clr-text)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="btn-secondary" style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}>
                                Proceed to Checkout <HiOutlineArrowRight size={16} />
                            </button>
                            {shippingCost > 0 && (
                                <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', textAlign: 'center', marginTop: '12px' }}>
                                    Add ₹{(2999 - cartTotal).toLocaleString('en-IN')} more for free shipping
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
