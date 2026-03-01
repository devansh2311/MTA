import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineTrash, HiOutlineShoppingBag } from 'react-icons/hi';
import { cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/Common';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await cartAPI.getWishlist();
            setWishlist(res.data);
        } catch (err) {
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await cartAPI.removeFromWishlist(itemId);
            setWishlist(prev => prev.filter(item => item.id !== itemId));
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product.id, 1);
            toast.success('Added to cart');
        } catch (err) {
            toast.error('Failed to add to cart');
        }
    };

    if (loading) return <LoadingSpinner size="lg" text="Loading wishlist..." />;

    if (wishlist.length === 0) {
        return (
            <div style={{ background: 'var(--clr-bg)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '400px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--clr-bg-alt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                        color: 'var(--clr-text-muted)'
                    }}>
                        <HiOutlineHeart size={40} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 12px', color: 'var(--clr-text)' }}>Your Wishlist is Empty</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>Find something you love and save it here for later.</p>
                    <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '70vh' }}>
            <div className="container" style={{ padding: '48px var(--space-lg) 80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
                    <HiOutlineHeart size={28} style={{ color: 'var(--clr-accent)' }} />
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: 0 }}>My Wishlist</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {wishlist.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card"
                            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            <Link to={`/products/${item.product_detail.slug}`} style={{ display: 'block', position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                                <img
                                    src={item.product_detail.primary_image || `https://placehold.co/400x400/FAF7F2/C4653A?text=${item.product_detail.name.charAt(0)}`}
                                    alt={item.product_detail.name}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/FAF7F2/C4653A?text=No+Image'; }}
                                />
                                {item.product_detail.discount_percentage > 0 && (
                                    <div className="badge badge-discount" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                                        {item.product_detail.discount_percentage}% OFF
                                    </div>
                                )}
                            </Link>

                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <Link to={`/products/${item.product_detail.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 4px' }}>
                                            {item.product_detail.name}
                                        </h3>
                                    </Link>
                                </div>

                                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', margin: '0 0 16px' }}>
                                    {item.product_detail.category_name}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px', marginTop: 'auto' }}>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--clr-text)' }}>
                                        ₹{Number(item.product_detail.effective_price).toLocaleString('en-IN')}
                                    </span>
                                    {item.product_detail.discount_price && (
                                        <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--clr-text-muted)' }}>
                                            ₹{Number(item.product_detail.price).toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleAddToCart(item.product_detail)}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                                        disabled={item.product_detail.stock === 0}
                                    >
                                        <HiOutlineShoppingBag size={16} />
                                        {item.product_detail.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                            background: 'var(--clr-bg-alt)', border: '1px solid var(--clr-border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--clr-error)', cursor: 'pointer', flexShrink: 0
                                        }}
                                        title="Remove from Wishlist"
                                    >
                                        <HiOutlineTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
