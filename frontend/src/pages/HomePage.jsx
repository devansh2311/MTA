import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [featuredRes, catRes] = await Promise.all([
                    productsAPI.getFeatured(),
                    productsAPI.getCategories(),
                ]);
                setFeatured(featuredRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error('Error loading homepage:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const features = [
        { icon: <HiOutlineSparkles size={24} />, title: 'Handcrafted', desc: '100% handwoven by artisans' },
        { icon: <HiOutlineTruck size={24} />, title: 'Free Shipping', desc: 'On orders above ₹2,999' },
        { icon: <HiOutlineShieldCheck size={24} />, title: 'Verified Quality', desc: 'Every piece inspected' },
        { icon: <HiOutlineRefresh size={24} />, title: 'Easy Returns', desc: '7-day return policy' },
    ];

    const testimonials = [
        { name: 'Ananya Krishnan', location: 'Chennai', text: 'The pure cotton bedsheets I ordered were absolutely stunning. The quality is evident in every thread.', rating: 5, initials: 'AK' },
        { name: 'Rohit Mehta', location: 'Delhi', text: 'Bought a set of premium towels for my mother. Authentic, super soft, and beautifully packaged. She loves them.', rating: 5, initials: 'RM' },
        { name: 'Priya Iyer', location: 'Bangalore', text: 'Great selection and the blackout curtains were exactly as described. Will definitely order again.', rating: 5, initials: 'PI' },
    ];

    const getCategoryEmoji = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('bedsheet')) return '🛏️';
        if (lower.includes('curtain')) return '🪟';
        if (lower.includes('towel')) return '🛁';
        if (lower.includes('rajai') || lower.includes('blanket')) return '🧣';
        if (lower.includes('footmat') || lower.includes('carpet')) return '🧶';
        if (lower.includes('pillow') || lower.includes('quilt')) return '🛋️';
        if (lower.includes('handicraft')) return '🏺';
        if (lower.includes('baby')) return '🧸';
        return '✨';
    };

    return (
        <div>
            {/* ===== HERO ===== */}
            <section style={{
                background: 'linear-gradient(160deg, #1A0F0A 0%, #2C1B0E 40%, #1B1212 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle geometric pattern */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }} />
                {/* Warm glow */}
                <div style={{
                    position: 'absolute', top: '-20%', right: '-10%',
                    width: '60vw', height: '80vh',
                    background: 'radial-gradient(ellipse, rgba(197,101,58,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0,1fr) minmax(0,auto)',
                        gap: '64px',
                        alignItems: 'center',
                        padding: '52px 0 60px',
                    }}>
                        {/* Left: Text content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            style={{ maxWidth: '600px' }}
                        >
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '5px 14px',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid rgba(196,101,58,0.4)',
                                background: 'rgba(196,101,58,0.1)',
                                color: 'var(--clr-accent)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                letterSpacing: '0.06em',
                                marginBottom: '24px',
                                textTransform: 'uppercase',
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clr-accent)', display: 'inline-block' }} />
                                New Arrivals Every Week
                            </div>

                            <h1 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)',
                                fontWeight: 600,
                                color: '#FFFFFF',
                                lineHeight: 1.08,
                                letterSpacing: '-0.03em',
                                marginBottom: '20px',
                            }}>
                                Quality Handloom
                                <span style={{ display: 'block', color: 'var(--clr-accent)', fontStyle: 'italic' }}>
                                    For Every Home
                                </span>
                            </h1>

                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.65,
                                color: 'rgba(255,255,255,0.55)',
                                maxWidth: '440px',
                                marginBottom: '32px',
                            }}>
                                Bedsheets, towels, curtains, blankets, rajai and more — premium quality handloom home textiles at honest prices.
                            </p>

                            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                <Link to="/products" className="btn-secondary" style={{ padding: '13px 30px', fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Shop Now <HiOutlineArrowRight size={16} />
                                </Link>
                                <Link to="/categories" style={{
                                    padding: '13px 30px',
                                    color: 'rgba(255,255,255,0.75)',
                                    borderColor: 'rgba(255,255,255,0.18)',
                                    border: '1.5px solid rgba(255,255,255,0.18)',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    fontSize: '0.88rem',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 500,
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                                >
                                    Browse Categories
                                </Link>
                            </div>

                            {/* Trust stats */}
                            <div style={{
                                display: 'flex',
                                gap: '36px',
                                marginTop: '48px',
                                paddingTop: '24px',
                                borderTop: '1px solid rgba(255,255,255,0.07)',
                                flexWrap: 'wrap',
                            }}>
                                {[
                                    { val: '200+', label: 'Artisans' },
                                    { val: '12', label: 'States' },
                                    { val: '₹2,999+', label: 'Free Shipping' },
                                    { val: '7-Day', label: 'Easy Returns' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--clr-accent)', margin: 0 }}>{s.val}</p>
                                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Product spotlight cards (desktop only) */}
                        <motion.div
                            className="hidden md:block"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexShrink: 0, width: '260px' }}
                        >
                            {[
                                { emoji: '🛏️', label: 'Bedsheets', clr: '#C5653A' },
                                { emoji: '🛁', label: 'Towels', clr: '#7C3AED' },
                                { emoji: '🪟', label: 'Curtains', clr: '#059669' },
                                { emoji: '🧣', label: 'Blankets', clr: '#2563EB' },
                            ].map((c, i) => (
                                <Link key={i} to={`/products?search=${c.label}`}
                                    style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        whileHover={{ y: -4, scale: 1.03 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            padding: '20px 16px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{c.emoji}</div>
                                        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', margin: 0, letterSpacing: '0.04em' }}>{c.label}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* ===== FEATURES BAR ===== */}
            <section style={{ background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border-light)' }}>
                <div className="container" style={{ padding: '32px var(--space-lg)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '8px 0' }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: 'var(--clr-accent-light)',
                                    color: 'var(--clr-accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, fontFamily: 'var(--font-body)', color: 'var(--clr-text)' }}>{f.title}</h4>
                                    <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--clr-text-muted)' }}>{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CATEGORIES ===== */}
            <section style={{ padding: '64px 0 40px', background: 'var(--clr-bg)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 className="section-title" style={{ display: 'inline-block' }}>Shop by Category</h2>
                        <p style={{ marginTop: '20px', color: 'var(--clr-text-secondary)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                            Explore our premium collection of authentic home textiles
                        </p>
                    </div>

                    <div className="hide-scrollbar" style={{
                        display: 'flex',
                        overflowX: 'auto',
                        gap: '24px',
                        paddingBottom: '20px',
                        scrollSnapType: 'x mandatory',
                    }}>
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={`/products?category_slug=${cat.slug}`}
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '32px 16px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        minWidth: '180px',
                                        scrollSnapAlign: 'start',
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{
                                        fontSize: '2.5rem',
                                        marginBottom: '14px',
                                        transition: 'transform 0.3s',
                                    }}>
                                        {getCategoryEmoji(cat.name)}
                                    </span>
                                    <h3 style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: 'var(--clr-text)',
                                        margin: 0,
                                    }}>
                                        {cat.name}
                                    </h3>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', margin: '4px 0 0' }}>
                                        {cat.product_count} products
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED PRODUCTS ===== */}
            <section className="section" style={{ background: 'var(--clr-surface)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 className="section-title">Featured Collection</h2>
                            <p style={{ marginTop: '16px', color: 'var(--clr-text-secondary)' }}>Handpicked favorites from our artisan partners</p>
                        </div>
                        <Link to="/products" className="btn-outline" style={{ textDecoration: 'none', padding: '10px 24px', fontSize: '0.8rem' }}>
                            View All <HiOutlineArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="card">
                                    <div className="skeleton" style={{ aspectRatio: '3/4' }}></div>
                                    <div style={{ padding: '20px' }}>
                                        <div className="skeleton" style={{ height: '12px', width: '80px', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '10px' }}></div>
                                        <div className="skeleton" style={{ height: '20px', width: '100px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                            {featured.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>



            {/* ===== TESTIMONIALS ===== */}
            <section className="section" style={{ background: 'var(--clr-bg)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 className="section-title" style={{ display: 'inline-block' }}>What Our Customers Say</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        maxWidth: '960px',
                        margin: '0 auto',
                    }}>
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="card"
                                style={{ padding: '32px' }}
                            >
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                                    {[...Array(t.rating)].map((_, j) => (
                                        <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="var(--clr-gold-light)">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>

                                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--clr-text)', marginBottom: '20px', fontStyle: 'italic' }}>
                                    "{t.text}"
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--clr-border-light)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--clr-accent-light)',
                                        color: 'var(--clr-accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        fontFamily: 'var(--font-body)',
                                    }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>{t.name}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', margin: 0 }}>{t.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
