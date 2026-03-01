import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineFilter, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, EmptyState } from '../components/Common';

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const currentPage = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category_slug') || '';
    const material = searchParams.get('material') || '';
    const minPrice = searchParams.get('min_price') || '';
    const maxPrice = searchParams.get('max_price') || '';
    const ordering = searchParams.get('ordering') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = { page: currentPage };
                if (search) params.search = search;
                if (categorySlug) params.category_slug = categorySlug;
                if (material) params.material = material;
                if (minPrice) params.min_price = minPrice;
                if (maxPrice) params.max_price = maxPrice;
                if (ordering) params.ordering = ordering;

                const res = await productsAPI.getAll(params);
                setProducts(res.data.results || res.data);
                setTotalPages(Math.ceil((res.data.count || 0) / 12));
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        productsAPI.getCategories().then(res => setCategories(res.data)).catch(console.error);
    }, []);

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value); else params.delete(key);
        if (key !== 'page') params.delete('page');
        setSearchParams(params);
    };

    const clearFilters = () => setSearchParams({});

    const materials = ['cotton', 'silk', 'wool', 'jute', 'linen', 'blend'];
    const priceRanges = [
        { label: 'Under ₹1,000', min: '', max: '1000' },
        { label: '₹1,000 – ₹5,000', min: '1000', max: '5000' },
        { label: '₹5,000 – ₹15,000', min: '5000', max: '15000' },
        { label: 'Above ₹15,000', min: '15000', max: '' },
    ];

    const hasActiveFilters = categorySlug || material || minPrice || maxPrice;

    return (
        <div>
            {/* Header */}
            <section style={{
                background: 'linear-gradient(160deg, #2C2C2C 0%, #1a1a1a 50%, #3D2B1F 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, padding: '24px var(--space-lg) 32px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-accent)', fontWeight: 600, marginBottom: '8px' }}>Collection</p>
                            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#FFFFFF', margin: 0, fontWeight: 600, lineHeight: 1.2 }}>
                                {categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ')}` : search ? `Search: "${search}"` : 'All Products'}
                            </h1>
                        </div>

                        {/* Search */}
                        <form onSubmit={(e) => { e.preventDefault(); }} style={{ flex: '1 1 320px', maxWidth: '420px' }}>
                            <div style={{ position: 'relative' }}>
                                <input type="text" value={search} onChange={(e) => updateParam('search', e.target.value)}
                                    placeholder="Search products..." style={{
                                        width: '100%', padding: '12px 44px 12px 16px', borderRadius: 'var(--radius-full)',
                                        border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
                                        color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none',
                                    }} />
                                <HiOutlineSearch size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section style={{ background: 'var(--clr-bg)', padding: '48px 0 80px' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '36px' }}>
                        {/* Sidebar Filters (Desktop) */}
                        <div className="hidden lg:block" style={{ width: '240px', flexShrink: 0 }}>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0, letterSpacing: '0.02em' }}>Filters</h3>
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Category */}
                                <div style={{ marginBottom: '28px' }}>
                                    <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-text-muted)', fontWeight: 600, marginBottom: '12px' }}>Category</h4>
                                    {categories.map(cat => (
                                        <button key={cat.id} onClick={() => updateParam('category_slug', categorySlug === cat.slug ? '' : cat.slug)}
                                            style={{
                                                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                                                fontSize: '0.82rem', background: categorySlug === cat.slug ? 'var(--clr-accent-light)' : 'transparent',
                                                color: categorySlug === cat.slug ? 'var(--clr-accent)' : 'var(--clr-text-secondary)',
                                                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                fontWeight: categorySlug === cat.slug ? 600 : 400, fontFamily: 'var(--font-body)', transition: 'all 0.15s', marginBottom: '2px',
                                            }}>
                                            {cat.name} <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>({cat.product_count})</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Material */}
                                <div style={{ marginBottom: '28px' }}>
                                    <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-text-muted)', fontWeight: 600, marginBottom: '12px' }}>Material</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {materials.map(m => (
                                            <button key={m} onClick={() => updateParam('material', material === m ? '' : m)}
                                                style={{
                                                    padding: '5px 14px', borderRadius: 'var(--radius-full)',
                                                    fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                                                    border: `1.5px solid ${material === m ? 'var(--clr-accent)' : 'var(--clr-border)'}`,
                                                    background: material === m ? 'var(--clr-accent)' : 'transparent',
                                                    color: material === m ? '#fff' : 'var(--clr-text-secondary)',
                                                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                                                }}>{m}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-text-muted)', fontWeight: 600, marginBottom: '12px' }}>Price Range</h4>
                                    {priceRanges.map((r, i) => (
                                        <button key={i} onClick={() => { updateParam('min_price', r.min); updateParam('max_price', r.max); }}
                                            style={{
                                                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                                                fontSize: '0.82rem', background: (minPrice === r.min && maxPrice === r.max) ? 'var(--clr-accent-light)' : 'transparent',
                                                color: (minPrice === r.min && maxPrice === r.max) ? 'var(--clr-accent)' : 'var(--clr-text-secondary)',
                                                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                                fontWeight: (minPrice === r.min && maxPrice === r.max) ? 600 : 400,
                                                fontFamily: 'var(--font-body)', transition: 'all 0.15s', marginBottom: '2px',
                                            }}>{r.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div style={{ flex: 1 }}>
                            {/* Toolbar */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                                <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', margin: 0 }}>
                                    {products.length} products found
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button className="lg:hidden" onClick={() => setShowFilters(!showFilters)}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 16px', borderRadius: 'var(--radius-full)',
                                            border: '1.5px solid var(--clr-border)', background: 'var(--clr-surface)',
                                            fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--clr-text)',
                                        }}>
                                        <HiOutlineFilter size={16} /> Filters
                                    </button>
                                    <select value={ordering} onChange={(e) => updateParam('ordering', e.target.value)}
                                        className="input-field" style={{ width: 'auto', padding: '8px 36px 8px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}>
                                        <option value="">Sort By</option>
                                        <option value="-created_at">Newest</option>
                                        <option value="price">Price: Low → High</option>
                                        <option value="-price">Price: High → Low</option>
                                        <option value="-avg_rating">Top Rated</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="card">
                                            <div className="skeleton" style={{ aspectRatio: '3/4' }}></div>
                                            <div style={{ padding: '18px' }}>
                                                <div className="skeleton" style={{ height: '10px', width: '60px', marginBottom: '8px' }}></div>
                                                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
                                                <div className="skeleton" style={{ height: '18px', width: '80px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <EmptyState title="No Products Found" message="Try adjusting your filters or search terms." />
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => updateParam('page', String(i + 1))}
                                            style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                border: currentPage === i + 1 ? 'none' : '1.5px solid var(--clr-border)',
                                                background: currentPage === i + 1 ? 'var(--clr-primary)' : 'var(--clr-surface)',
                                                color: currentPage === i + 1 ? '#fff' : 'var(--clr-text-secondary)',
                                                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600,
                                                transition: 'all 0.2s',
                                            }}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
