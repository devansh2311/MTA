import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChatAlt2, HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch, HiOutlineHeart, HiOutlineMenu, HiOutlineX, HiOutlineChartBar, HiOutlineCollection, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// ─── Owner Navbar ─────────────────────────────────────────────────────────────
function OwnerNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navLinks = [
        { to: '/owner/dashboard', label: 'Overview', icon: <HiOutlineChartBar size={16} />, tab: 'overview' },
        { to: '/owner/dashboard?tab=products', label: 'Products', icon: <HiOutlineCollection size={16} />, tab: 'products' },
        { to: '/owner/dashboard?tab=orders', label: 'Orders', icon: <HiOutlineClipboardList size={16} />, tab: 'orders' },
        { to: '/owner/dashboard?tab=customers', label: 'Customers', icon: <HiOutlineUserGroup size={16} />, tab: 'customers' },
        { to: '/owner/dashboard?tab=messages', label: 'Messages', icon: <HiOutlineChatAlt2 size={16} />, tab: 'messages' },
        { to: '/owner/dashboard?tab=settings', label: 'Shop Settings', icon: <HiOutlineCog size={16} />, tab: 'settings' },
    ];

    const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: '#1B1212',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                {/* Logo */}
                <Link to="/owner/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--clr-accent) 0%, #8b4513 100%)',
                        boxShadow: '0 4px 10px rgba(196,101,58,0.25)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px',
                        letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}>MTA</div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>Mohindra Handloom</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-accent)', fontWeight: 600 }}>Seller Portal</div>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
                    {navLinks.map(link => {
                        const isActive = (link.tab === 'overview' && !new URLSearchParams(location.search).get('tab')) || activeTab === link.tab;
                        return (
                            <Link key={link.to} to={link.to}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 14px', borderRadius: 'var(--radius-md)',
                                    fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                                    background: isActive ? 'rgba(197,101,58,0.25)' : 'transparent',
                                    textDecoration: 'none', transition: 'all 0.2s',
                                    border: isActive ? '1px solid rgba(197,101,58,0.4)' : '1px solid transparent',
                                }}
                                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; } }}
                            >
                                {link.icon} {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right: user info + logout */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'var(--clr-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                        }}>
                            {user?.first_name?.charAt(0) || 'O'}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', margin: 0 }}>{user?.first_name} {user?.last_name}</p>
                            <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={() => { logout(); navigate('/owner/login'); }} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px', borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)'; e.currentTarget.style.color = '#EF4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                        <HiOutlineLogout size={15} /> Logout
                    </button>
                    {/* Mobile toggle */}
                    <button className="md:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: '6px' }}>
                        {isMobileOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {navLinks.map(link => (
                                <Link key={link.to} to={link.to} onClick={() => setIsMobileOpen(false)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                                    {link.icon} {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}


// ─── Customer Navbar ──────────────────────────────────────────────────────────
export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, isAuthenticated, isOwner, logout } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // ALL hooks must fire before any conditional return
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const close = (e) => {
            if (isUserMenuOpen && !e.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [isUserMenuOpen]);

    // If owner, render owner nav (after hooks have all been called)
    if (isOwner) return <OwnerNavbar />;


    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Shop' },
        { to: '/categories', label: 'Categories' },
        { to: '/about', label: 'Our Story' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <>
            {/* Announcement Bar */}
            <div style={{
                background: 'var(--clr-primary)',
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                fontSize: '0.75rem',
                padding: '8px 16px',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.04em',
                fontWeight: 500,
            }}>
                Free Shipping on Orders Above ₹2,999 · Handcrafted with Love
            </div>

            {/* Main Navbar */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                transition: 'all 0.3s ease',
                background: isScrolled ? 'rgba(255,255,255,0.97)' : 'var(--clr-surface)',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderBottom: `1px solid ${isScrolled ? 'var(--clr-border)' : 'var(--clr-border-light)'}`,
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textDecoration: 'none',
                    }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-accent) 100%)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            fontSize: '15px',
                            letterSpacing: '1px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}>
                            MTA
                        </div>
                        <div>
                            <div style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: 'var(--clr-text)',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                            }}>
                                Mohindra
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.6rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--clr-accent)',
                                fontWeight: 600,
                            }}>
                                Handloom
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex" style={{ alignItems: 'center', gap: '36px' }}>
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{
                                        fontSize: '0.85rem',
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? 'var(--clr-accent)' : 'var(--clr-text-secondary)',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        letterSpacing: '0.01em',
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--clr-accent)'}
                                    onMouseLeave={(e) => { if (!isActive) e.target.style.color = 'var(--clr-text-secondary)' }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Search */}
                        <form onSubmit={handleSearch} className="hidden lg:flex" style={{ position: 'relative', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '200px',
                                    padding: '8px 36px 8px 14px',
                                    background: 'var(--clr-bg)',
                                    border: '1.5px solid var(--clr-border)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8rem',
                                    color: 'var(--clr-text)',
                                    outline: 'none',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'all 0.2s',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--clr-accent)'; e.target.style.width = '240px'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--clr-border)'; e.target.style.width = '200px'; }}
                            />
                            <button type="submit" style={{
                                position: 'absolute',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--clr-text-muted)',
                                padding: '2px',
                            }}>
                                <HiOutlineSearch size={16} />
                            </button>
                        </form>

                        {/* Wishlist */}
                        {isAuthenticated && (
                            <Link to="/wishlist" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                color: 'var(--clr-text-secondary)',
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <HiOutlineHeart size={20} />
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            color: 'var(--clr-text-secondary)',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-bg)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <HiOutlineShoppingBag size={20} />
                            {cartItemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: 'var(--clr-accent)',
                                    color: 'white',
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        <div className="user-menu-container" style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: isUserMenuOpen ? 'var(--clr-bg)' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    color: 'var(--clr-text-secondary)',
                                    transition: 'all 0.2s',
                                    fontFamily: 'var(--font-body)',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--clr-bg)'}
                                onMouseLeave={(e) => { if (!isUserMenuOpen) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <HiOutlineUser size={20} />
                                {isAuthenticated && (
                                    <span className="hidden md:inline" style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                        {user?.first_name || user?.username}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 'calc(100% + 8px)',
                                            width: '220px',
                                            background: 'var(--clr-surface)',
                                            borderRadius: 'var(--radius-lg)',
                                            boxShadow: 'var(--shadow-xl)',
                                            border: '1px solid var(--clr-border-light)',
                                            overflow: 'hidden',
                                            zIndex: 50,
                                        }}
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <div style={{
                                                    padding: '16px',
                                                    borderBottom: '1px solid var(--clr-border-light)',
                                                    background: 'var(--clr-bg)',
                                                }}>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: 0 }}>
                                                        {user?.first_name} {user?.last_name}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: 0, marginTop: '2px' }}>
                                                        {user?.email}
                                                    </p>
                                                </div>
                                                <div style={{ padding: '8px' }}>
                                                    <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}
                                                        style={{ display: 'block', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text-secondary)', transition: 'all 0.15s' }}
                                                        onMouseEnter={(e) => e.target.style.background = 'var(--clr-bg)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                    >
                                                        My Dashboard
                                                    </Link>
                                                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}
                                                        style={{ display: 'block', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text-secondary)', transition: 'all 0.15s' }}
                                                        onMouseEnter={(e) => e.target.style.background = 'var(--clr-bg)'}
                                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                    >
                                                        My Orders
                                                    </Link>
                                                    <div style={{ height: '1px', background: 'var(--clr-border-light)', margin: '4px 0' }}></div>
                                                    <button
                                                        onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}
                                                        style={{
                                                            width: '100%',
                                                            textAlign: 'left',
                                                            padding: '10px 12px',
                                                            fontSize: '0.8rem',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderRadius: 'var(--radius-sm)',
                                                            cursor: 'pointer',
                                                            color: 'var(--clr-error)',
                                                            fontFamily: 'var(--font-body)',
                                                            transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.background = '#FEF2F2'}
                                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ padding: '8px' }}>
                                                <Link to="/login" onClick={() => setIsUserMenuOpen(false)}
                                                    style={{ display: 'block', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text-secondary)', fontWeight: 500, transition: 'all 0.15s' }}
                                                    onMouseEnter={(e) => e.target.style.background = 'var(--clr-bg)'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    Customer Login
                                                </Link>
                                                <Link to="/signup" onClick={() => setIsUserMenuOpen(false)}
                                                    style={{ display: 'block', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text-secondary)', transition: 'all 0.15s' }}
                                                    onMouseEnter={(e) => e.target.style.background = 'var(--clr-bg)'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    Create Account
                                                </Link>
                                                <div style={{ height: '1px', background: 'var(--clr-border-light)', margin: '4px 0' }}></div>
                                                <Link to="/owner/login" onClick={() => setIsUserMenuOpen(false)}
                                                    style={{ display: 'block', padding: '10px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', color: 'var(--clr-accent)', fontWeight: 500, transition: 'all 0.15s' }}
                                                    onMouseEnter={(e) => e.target.style.background = 'var(--clr-accent-light)'}
                                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    Seller Portal →
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                color: 'var(--clr-text)',
                                display: 'flex',
                            }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                overflow: 'hidden',
                                borderTop: '1px solid var(--clr-border-light)',
                            }}
                        >
                            <div className="container" style={{ padding: '20px var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '12px' }}>
                                    <input type="text" placeholder="Search products..." value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)} className="input-field" style={{ paddingRight: '40px' }} />
                                    <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}>
                                        <HiOutlineSearch size={16} />
                                    </button>
                                </form>
                                {navLinks.map((link) => (
                                    <Link key={link.to} to={link.to}
                                        style={{
                                            padding: '12px 0',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                            color: 'var(--clr-text)',
                                            borderBottom: '1px solid var(--clr-border-light)',
                                        }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}
