import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { LoadingSpinner } from '../components/Common';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productsAPI.getCategories().then(res => { setCategories(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

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

    if (loading) return <LoadingSpinner size="lg" text="Loading categories..." />;

    return (
        <div>
            {/* Header */}
            <section style={{
                background: 'linear-gradient(160deg, #2C2C2C 0%, #1a1a1a 50%, #3D2B1F 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '64px var(--space-lg) 80px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-accent)', fontWeight: 600, marginBottom: '16px' }}>Browse</p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', margin: '0 0 16px', fontWeight: 600 }}>Shop by Category</h1>
                        <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '480px', margin: '0 auto' }}>Discover our curated collection of authentic handloom textiles</p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="section" style={{ background: 'var(--clr-bg)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
                        {categories.map((cat, i) => (
                            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}>
                                <Link to={`/products?category_slug=${cat.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', textDecoration: 'none', textAlign: 'center' }}>
                                    <span style={{ fontSize: '3rem', marginBottom: '16px' }}>{getCategoryEmoji(cat.name)}</span>
                                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 6px' }}>{cat.name}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', margin: 0 }}>{cat.product_count} products</p>
                                    {cat.description && <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-secondary)', margin: '10px 0 0', lineHeight: 1.5 }}>{cat.description}</p>}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
