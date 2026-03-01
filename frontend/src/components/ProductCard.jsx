import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiStar } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
    const { cart, addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const effectivePrice = product.discount_price || product.price;
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const discountPercent = hasDiscount ? Math.round((1 - product.discount_price / product.price) * 100) : 0;
    const isInStock = product.stock > 0;
    const isLowStock = product.stock > 0 && product.stock <= 3;

    // How many of this product are already in cart
    const cartItem = cart?.items?.find(i => i.product === product.id || i.product_id === product.id);
    const cartQty = cartItem?.quantity || 0;
    const canAddMore = isInStock && cartQty < product.stock;

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!isAuthenticated || !canAddMore) return;
        addToCart(product.id, 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card group"
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            {/* Image */}
            <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '4/3',          // landscape — full picture visible
                    background: 'var(--clr-bg-alt)',
                }}>
                    <img
                        src={product.primary_image || `https://placehold.co/400x300/FAF7F2/C4653A?text=${encodeURIComponent(product.name || 'Product')}`}
                        alt={product.name}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onError={(e) => { e.target.src = `https://placehold.co/400x300/FAF7F2/C4653A?text=${encodeURIComponent(product.name?.charAt(0) || 'P')}`; }}
                    />

                    {/* Badges top-left */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>

                        {product.is_featured && (
                            <span className="badge badge-featured" style={{ fontSize: '0.6rem' }}>Featured</span>
                        )}
                    </div>

                    {/* Out of stock overlay */}
                    {!isInStock && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{
                                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.92)', color: '#111',
                                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em',
                            }}>OUT OF STOCK</span>
                        </div>
                    )}

                    {/* Low stock warning */}
                    {isLowStock && (
                        <div style={{
                            position: 'absolute', bottom: '8px', left: '8px',
                            background: '#DC2626', color: '#fff',
                            padding: '3px 10px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em',
                        }}>
                            Only {product.stock} left!
                        </div>
                    )}
                </div>
            </Link>

            {/* Info */}
            <div style={{ padding: '12px 14px 14px' }}>
                {product.category_name && (
                    <p style={{
                        fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: 'var(--clr-accent)', fontWeight: 600, margin: '0 0 4px',
                    }}>{product.category_name}</p>
                )}

                <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                        fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 600,
                        color: 'var(--clr-text)', margin: '0 0 6px', lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{product.name}</h3>
                </Link>

                {/* Rating */}
                {product.avg_rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '1px' }}>
                            {[...Array(5)].map((_, i) => (
                                <HiStar key={i} size={11} style={{ color: i < Math.round(product.avg_rating) ? 'var(--clr-gold-light)' : 'var(--clr-border)' }} />
                            ))}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)' }}>({product.review_count})</span>
                    </div>
                )}

                {/* Price + Add to Cart */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{
                            fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--clr-text)',
                        }}>₹{Number(effectivePrice).toLocaleString('en-IN')}</span>
                        {hasDiscount && (
                            <>
                                <span style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                                    ₹{Number(product.price).toLocaleString('en-IN')}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--clr-success)', fontWeight: 700, marginLeft: '6px' }}>
                                    {discountPercent}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {isInStock ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={!canAddMore}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                border: canAddMore ? '1.5px solid var(--clr-border)' : '1.5px solid var(--clr-border-light)',
                                background: canAddMore ? 'var(--clr-surface)' : 'var(--clr-bg-alt)',
                                cursor: canAddMore ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: canAddMore ? 'var(--clr-text-secondary)' : 'var(--clr-text-muted)',
                                transition: 'all 0.25s', opacity: canAddMore ? 1 : 0.5,
                            }}
                            onMouseEnter={(e) => {
                                if (!canAddMore) return;
                                e.currentTarget.style.background = 'var(--clr-accent)';
                                e.currentTarget.style.borderColor = 'var(--clr-accent)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                if (!canAddMore) return;
                                e.currentTarget.style.background = 'var(--clr-surface)';
                                e.currentTarget.style.borderColor = 'var(--clr-border)';
                                e.currentTarget.style.color = 'var(--clr-text-secondary)';
                            }}
                            title={canAddMore ? 'Add to Cart' : cartQty >= product.stock ? `Max ${product.stock} in cart` : 'Out of Stock'}
                        >
                            <HiOutlineShoppingBag size={14} />
                        </button>
                    ) : (
                        <span style={{ fontSize: '0.65rem', color: '#DC2626', fontWeight: 600 }}>Sold Out</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
