import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiStar, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh, HiMinus, HiPlus } from 'react-icons/hi';
import { productsAPI, cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, StarRating } from '../components/Common';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
    const { addToCart } = useCart();
    const { isAuthenticated, isCustomer } = useAuth();
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await productsAPI.getBySlug(slug);
                setProduct(res.data);

                if (isAuthenticated) {
                    const wishRes = await cartAPI.getWishlist();
                    setInWishlist(wishRes.data.some(w => w.product_detail.id === res.data.id));
                }

                if (res.data.category?.slug) {
                    setRelatedLoading(true);
                    productsAPI.getAll({ category_slug: res.data.category.slug })
                        .then(relRes => {
                            const filtered = (relRes.data.results || relRes.data).filter(p => p.id !== res.data.id).slice(0, 4);
                            setRelatedProducts(filtered);
                        })
                        .catch(err => console.error('Error fetching related:', err))
                        .finally(() => setRelatedLoading(false));
                }
            }
            catch (err) { console.error('Error:', err); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [slug, isAuthenticated]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
        await addToCart(product.id, quantity);
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) { toast.error('Please login to buy items'); return; }
        navigate('/checkout', { state: { buyNowItem: { product, quantity } } });
    };

    const toggleWishlist = async () => {
        if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
        setWishlistLoading(true);
        try {
            if (inWishlist) {
                const wishRes = await cartAPI.getWishlist();
                const item = wishRes.data.find(w => w.product_detail.id === product.id);
                if (item) {
                    await cartAPI.removeFromWishlist(item.id);
                    setInWishlist(false);
                    toast.success('Removed from wishlist');
                }
            } else {
                await cartAPI.addToWishlist(product.id);
                setInWishlist(true);
                toast.success('Added to wishlist');
            }
        } catch (err) {
            toast.error('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await productsAPI.addReview(product.id, reviewForm);
            toast.success('Review submitted!');
            const res = await productsAPI.getBySlug(slug);
            setProduct(res.data);
            setReviewForm({ rating: 5, title: '', comment: '' });
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to submit review'); }
    };

    if (loading) return <LoadingSpinner size="lg" text="Loading product details..." />;
    if (!product) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h2>Product not found</h2></div>;

    const images = product.images?.length > 0 ? product.images : [{ image: `https://placehold.co/600x800/FAF7F2/C4653A?text=${encodeURIComponent(product.name.substring(0, 20))}`, alt_text: product.name }];

    return (
        <div style={{ background: 'var(--clr-bg)' }}>
            {/* Breadcrumb */}
            <div className="container" style={{ padding: '20px var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                    <Link to="/" style={{ color: 'var(--clr-text-muted)' }}>Home</Link>
                    <span>/</span>
                    <Link to="/products" style={{ color: 'var(--clr-text-muted)' }}>Products</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--clr-text)' }}>{product.name}</span>
                </div>
            </div>

            {/* Product Section */}
            <div className="container" style={{ paddingBottom: '80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }}>
                    {/* For larger screens use CSS media query */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
                            {/* Image Gallery */}
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 400px', maxWidth: '560px' }}>
                                <div className="card" style={{ overflow: 'hidden', position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
                                    <div style={{ aspectRatio: '0.83', overflow: 'hidden' }}>
                                        <img
                                            src={images[selectedImage]?.image}
                                            alt={images[selectedImage]?.alt_text || product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', cursor: 'zoom-in' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                            onError={(e) => { e.target.src = `https://placehold.co/600x800/FAF7F2/C4653A?text=${encodeURIComponent(product.name.substring(0, 20))}`; }}
                                        />
                                    </div>
                                    {/* Prev/Next Arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                                style={{
                                                    position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                                                    width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.2rem', color: 'var(--clr-text)', boxShadow: 'var(--shadow-md)',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,1)'}
                                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.85)'}
                                            >‹</button>
                                            <button onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                                style={{
                                                    position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                                                    width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                                                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1.2rem', color: 'var(--clr-text)', boxShadow: 'var(--shadow-md)',
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,1)'}
                                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.85)'}
                                            >›</button>
                                            {/* Image Counter */}
                                            <span style={{
                                                position: 'absolute', bottom: '12px', right: '12px',
                                                background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px',
                                                borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 600,
                                            }}>{selectedImage + 1} / {images.length}</span>
                                        </>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                                        {images.map((img, i) => (
                                            <button key={i} onClick={() => setSelectedImage(i)} style={{
                                                width: '72px', height: '72px', borderRadius: 'var(--radius-md)',
                                                overflow: 'hidden', border: `2px solid ${selectedImage === i ? 'var(--clr-accent)' : 'var(--clr-border)'}`,
                                                padding: 0, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                                            }}>
                                                <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = `https://placehold.co/100x100/FAF7F2/C4653A?text=${i + 1}`; }} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Product Info */}
                            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 360px' }}>
                                <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--clr-accent)', margin: '0 0 12px' }}>
                                    {product.category?.name} • {product.origin || 'India'}
                                </p>

                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--clr-text)', margin: '0 0 8px', lineHeight: 1.2 }}>
                                    {product.name}
                                </h1>

                                <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', margin: '0 0 16px' }}>
                                    by <span style={{ fontWeight: 600, color: 'var(--clr-text)' }}>{product.owner_shop}</span>
                                </p>

                                {/* Rating */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar key={i} size={16} style={{ color: i < Math.round(product.average_rating) ? 'var(--clr-gold-light)' : 'var(--clr-border)' }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)' }}>{product.average_rating}</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>({product.review_count} reviews)</span>
                                </div>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--clr-text)' }}>
                                        ₹{Number(product.effective_price).toLocaleString('en-IN')}
                                    </span>
                                    {product.discount_price && (
                                        <>
                                            <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--clr-text-muted)' }}>
                                                ₹{Number(product.price).toLocaleString('en-IN')}
                                            </span>
                                            <span className="badge badge-discount">{product.discount_percentage}% OFF</span>
                                        </>
                                    )}
                                </div>

                                {/* Short Description */}
                                {product.short_description && (
                                    <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--clr-text-secondary)', marginBottom: '24px' }}>
                                        {product.short_description}
                                    </p>
                                )}

                                {/* Product Specs */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                                    {product.material && (
                                        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-alt)' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Material</p>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0, textTransform: 'capitalize' }}>{product.material}</p>
                                        </div>
                                    )}
                                    {product.weave_type && (
                                        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-alt)' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Weave</p>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>{product.weave_type}</p>
                                        </div>
                                    )}
                                    {product.dimensions && (
                                        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-alt)' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dimensions</p>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>{product.dimensions}</p>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--clr-bg-alt)' }}>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', margin: '0 0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Weight</p>
                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>{product.weight}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Stock */}
                                <div style={{ marginBottom: '24px' }}>
                                    {product.stock > 0 ? (
                                        <p style={{ fontSize: '0.82rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-success)', display: 'inline-block' }}></span>
                                            <span style={{ color: 'var(--clr-success)', fontWeight: 600 }}>In Stock</span>
                                            <span style={{ color: 'var(--clr-text-muted)' }}>({product.stock} available)</span>
                                        </p>
                                    ) : (
                                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-error)', margin: 0 }}>Out of Stock</p>
                                    )}
                                </div>

                                {/* Quantity & Actions */}
                                {product.stock > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--clr-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '42px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text-secondary)' }}>
                                                <HiMinus size={14} />
                                            </button>
                                            <span style={{ width: '48px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: 'var(--clr-text)' }}>{quantity}</span>
                                            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: '40px', height: '42px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-text-secondary)' }}>
                                                <HiPlus size={14} />
                                            </button>
                                        </div>
                                        <button onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, padding: '12px 24px' }}>
                                            <HiOutlineShoppingBag size={18} /> Add to Cart
                                        </button>
                                        <button onClick={handleBuyNow} className="btn-secondary" style={{ flex: 1, padding: '12px 24px' }}>Buy Now</button>
                                        <button
                                            onClick={toggleWishlist}
                                            disabled={wishlistLoading}
                                            style={{
                                                width: '46px', height: '46px', borderRadius: '50%',
                                                background: 'var(--clr-bg-alt)', border: '1.5px solid var(--clr-border)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: inWishlist ? '#EF4444' : 'var(--clr-text-secondary)',
                                                cursor: 'pointer', flexShrink: 0,
                                                transition: 'all 0.2s',
                                                opacity: wishlistLoading ? 0.7 : 1
                                            }}
                                            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <HiOutlineHeart size={22} style={{ fill: inWishlist ? '#EF4444' : 'none' }} />
                                        </button>
                                    </div>
                                )}

                                {/* Trust badges & Returns */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--clr-border-light)' }}>
                                    {[
                                        { icon: <HiOutlineTruck size={16} />, text: 'Free Shipping' },
                                        { icon: <HiOutlineShieldCheck size={16} />, text: 'Authentic Product' },
                                    ].map((b, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--clr-text-secondary)' }}>
                                            <span style={{ color: 'var(--clr-accent)' }}>{b.icon}</span>
                                            {b.text}
                                        </div>
                                    ))}

                                    {/* Return Policy inline badge */}
                                    {(() => {
                                        const policyMap = {
                                            'no_return': { label: 'No Return Policy', color: '#DC2626' },
                                            '7_days': { label: '7-Day Return Policy', color: '#059669' },
                                            '10_days': { label: '10-Day Return Policy', color: '#059669' },
                                            '15_days': { label: '15-Day Return Policy', color: '#059669' },
                                            '30_days': { label: '30-Day Return Policy', color: '#059669' },
                                        };
                                        const pol = policyMap[product.return_policy] || policyMap['no_return'];
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--clr-text-secondary)' }}>
                                                <span style={{ color: pol.color }}><HiOutlineRefresh size={16} /></span>
                                                <span style={{ color: pol.color, fontWeight: 600 }}>{pol.label}</span>
                                            </div>
                                        );
                                    })()}

                                    {/* Replacement inline badge */}
                                    {product.replacement_allowed && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--clr-text-secondary)' }}>
                                            <span style={{ color: '#2563EB' }}><HiOutlineRefresh size={16} /></span>
                                            <span style={{ color: '#2563EB', fontWeight: 600 }}>Replacement Available</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Tabs: Description, Care, Reviews */}
                        <div>
                            <div style={{ display: 'flex', gap: '32px', borderBottom: '2px solid var(--clr-border-light)', marginBottom: '28px' }}>
                                {['description', 'care', 'reviews'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                        paddingBottom: '14px', fontSize: '0.85rem', fontWeight: 600,
                                        fontFamily: 'var(--font-body)', textTransform: 'capitalize',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: activeTab === tab ? 'var(--clr-text)' : 'var(--clr-text-muted)',
                                        borderBottom: activeTab === tab ? '2px solid var(--clr-accent)' : '2px solid transparent',
                                        marginBottom: '-2px', transition: 'all 0.2s',
                                    }}>
                                        {tab === 'reviews' ? `Reviews (${product.review_count})` : tab}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'description' && (
                                <div className="card" style={{ padding: '32px', maxWidth: '700px' }}>
                                    <p style={{ lineHeight: 1.8, color: 'var(--clr-text-secondary)' }}>{product.description}</p>
                                </div>
                            )}

                            {activeTab === 'care' && (
                                <div className="card" style={{ padding: '32px', maxWidth: '700px' }}>
                                    <p style={{ lineHeight: 1.8, color: 'var(--clr-text-secondary)' }}>
                                        {product.care_instructions || 'Please refer to the product label for care instructions.'}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div style={{ maxWidth: '700px' }}>
                                    {/* Review Summary */}
                                    <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0 }}>{product.average_rating}</p>
                                                <StarRating rating={Math.round(product.average_rating)} />
                                                <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', margin: '4px 0 0' }}>{product.review_count} reviews</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Write Review */}
                                    {isAuthenticated && isCustomer && (
                                        <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', margin: '0 0 20px', color: 'var(--clr-text)' }}>Write a Review</h3>
                                            <form onSubmit={handleSubmitReview}>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Rating</label>
                                                    <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} interactive />
                                                </div>
                                                <input type="text" placeholder="Review title" value={reviewForm.title}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} className="input-field" style={{ marginBottom: '12px' }} />
                                                <textarea placeholder="Share your experience..." value={reviewForm.comment}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows="3" className="input-field" style={{ marginBottom: '16px' }} required></textarea>
                                                <button type="submit" className="btn-secondary">Submit Review</button>
                                            </form>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {product.reviews?.map(review => (
                                            <div key={review.id} className="card" style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%',
                                                        background: 'var(--clr-accent-light)', color: 'var(--clr-accent)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.8rem',
                                                    }}>
                                                        {(review.user_name || 'U').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>{review.user_name || 'Anonymous'}</p>
                                                        <StarRating rating={review.rating} size={13} />
                                                    </div>
                                                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
                                                        {new Date(review.created_at).toLocaleDateString('en-IN')}
                                                    </span>
                                                </div>
                                                {review.title && <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 6px', color: 'var(--clr-text)' }}>{review.title}</h4>}
                                                <p style={{ fontSize: '0.82rem', lineHeight: 1.65, color: 'var(--clr-text-secondary)', margin: 0 }}>{review.comment}</p>
                                            </div>
                                        ))}
                                        {product.reviews?.length === 0 && (
                                            <p style={{ textAlign: 'center', padding: '48px 0', color: 'var(--clr-text-muted)' }}>No reviews yet. Be the first to review!</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {!relatedLoading && relatedProducts.length > 0 && (
                    <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--clr-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--clr-text)', margin: 0 }}>You May Also Like</h2>
                            <Link to={`/products?category=${product.category?.slug}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-accent)', textDecoration: 'none' }}>
                                View all {product.category?.name} →
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                            {relatedProducts.map(relProduct => {
                                const relImages = relProduct.images?.length > 0 ? relProduct.images : [{ image: `https://placehold.co/400x500/FAF7F2/C4653A?text=${encodeURIComponent(relProduct.name.substring(0, 10))}` }];
                                return (
                                    <Link to={`/products/${relProduct.slug}`} key={relProduct.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', overflow: 'hidden' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                                        >
                                            <div style={{ position: 'relative', aspectRatio: '0.8', overflow: 'hidden', background: 'var(--clr-bg-alt)' }}>
                                                <img
                                                    src={relImages[0].image}
                                                    alt={relProduct.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                />
                                            </div>
                                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-accent)', margin: '0 0 6px', fontWeight: 600 }}>{relProduct.category?.name}</p>
                                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--clr-text)', margin: '0 0 8px', lineHeight: 1.3, flex: 1 }}>{relProduct.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-text)' }}>
                                                        ₹{Number(relProduct.effective_price).toLocaleString('en-IN')}
                                                    </span>
                                                    {relProduct.discount_price && (
                                                        <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--clr-text-muted)' }}>
                                                            ₹{Number(relProduct.price).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
