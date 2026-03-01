import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) { setEmail(''); }
    };

    return (
        <footer style={{ background: 'var(--clr-primary)', color: 'rgba(255,255,255,0.7)' }}>
            {/* Newsletter Section */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="container" style={{ padding: '56px var(--space-lg)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
                    <div style={{ maxWidth: '400px' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            margin: '0 0 8px',
                        }}>
                            Join Our Community
                        </h3>
                        <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                            Subscribe for exclusive offers, artisan stories, and early access to new collections.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '420px' }}>
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '14px 18px',
                                borderRadius: 'var(--radius-full)',
                                border: '1.5px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.06)',
                                color: '#FFFFFF',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                outline: 'none',
                            }}
                        />
                        <button type="submit" style={{
                            padding: '14px 28px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--clr-accent)',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                        }}>
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="container" style={{ padding: '56px var(--space-lg)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '48px',
                }}>
                    {/* Brand */}
                    <div style={{ maxWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, var(--clr-accent) 0%, #8b4513 100%)',
                                boxShadow: '0 4px 10px rgba(196,101,58,0.25)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px',
                                letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}>MTA</div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>Mohindra Handloom</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
                            Premium handloom home textiles directly from Ambala. We offer superior quality bedsheets, curtains, towels, and home accessories.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {['f', 'in', 'x', 'p'].map((icon, i) => (
                                <a key={i} href="#" style={{
                                    width: '34px', height: '34px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-accent)'; e.currentTarget.style.borderColor = 'var(--clr-accent)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                                >{icon}</a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                            Quick Links
                        </h4>
                        {[
                            { to: '/products', label: 'All Products' },
                            { to: '/categories', label: 'Categories' },
                            { to: '/about', label: 'About Us' },
                            { to: '/contact', label: 'Contact Us' },
                            { to: '/owner/signup', label: 'Sell on Mohindra Handloom' },
                        ].map(link => (
                            <Link key={link.to} to={link.to} style={{
                                display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', padding: '6px 0',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.target.style.color = '#fff'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                            >{link.label}</Link>
                        ))}
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                            Customer Service
                        </h4>
                        {['Shipping Policy', 'Return & Exchange', 'FAQs', 'Size Guide', 'Care Instructions'].map(label => (
                            <a key={label} href="#" style={{
                                display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', padding: '6px 0', transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.target.style.color = '#fff'}
                                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                            >{label}</a>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                            Contact Us
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                                <HiOutlineLocationMarker size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--clr-accent)' }} />
                                Shop No. 1, 2 Shree Ganesh Cloth Market, Ambala City
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                                <HiOutlinePhone size={18} style={{ flexShrink: 0, color: 'var(--clr-accent)' }} />
                                +91 9416114057
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                                <HiOutlineMail size={18} style={{ flexShrink: 0, color: 'var(--clr-accent)' }} />
                                Mohindrahandloom74@gmail.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="container" style={{
                    padding: '20px var(--space-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.3)',
                }}>
                    <span>© {new Date().getFullYear()} Mohindra Handloom. All rights reserved.</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                        >Privacy Policy</a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                        >Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
