import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineHeart, HiOutlineGlobe, HiOutlineUserGroup } from 'react-icons/hi';

export default function AboutPage() {
    const values = [
        { icon: <HiOutlineSparkles size={28} />, title: 'Quality Originality', desc: 'Every product is verified for authentic craftsmanship, ensuring premium quality for your home.' },
        { icon: <HiOutlineHeart size={28} />, title: 'Fair Trade', desc: 'Our suppliers and partners receive fair compensation, supporting sustainable local businesses.' },
        { icon: <HiOutlineGlobe size={28} />, title: 'Sustainability', desc: 'Our home textiles are eco-friendly, using natural fibers and long-lasting materials.' },
        { icon: <HiOutlineUserGroup size={28} />, title: 'Community', desc: 'We build bridges between quality manufacturers and customers, fostering appreciation for Indian textiles.' },
    ];

    const stats = [
        { number: '50+', label: 'Trusted Suppliers' },
        { number: '12', label: 'Categories' },
        { number: '5,000+', label: 'Products' },
        { number: '10K+', label: 'Happy Customers' },
    ];

    return (
        <div>
            {/* Hero */}
            <section style={{
                background: 'linear-gradient(160deg, #2C2C2C 0%, #1a1a1a 50%, #3D2B1F 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px var(--space-lg) 100px' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-accent)', fontWeight: 600, marginBottom: '16px' }}>
                            Our Story
                        </p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFFFFF', margin: '0 0 20px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                            Quality Textiles <span style={{ color: 'var(--clr-accent)', fontStyle: 'italic' }}>For Every Home</span>
                        </h1>
                        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: '580px', margin: '0 auto' }}>
                            Connecting Ambala's finest home textiles with customers who appreciate comfort and durability.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section" style={{ background: 'var(--clr-surface)' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', textAlign: 'center', marginBottom: '32px', color: 'var(--clr-text)' }}>
                            The Story Behind Our Mission
                        </h2>
                        <div style={{ fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--clr-text-secondary)' }}>
                            <p style={{ marginBottom: '20px' }}>
                                Based in the heart of Ambala City's Cloth Market, we have a deep-rooted history in sourcing and providing the finest home textiles. From pure cotton bedsheets to intricately designed curtains, our focus has always been on quality.
                            </p>
                            <p style={{ marginBottom: '20px' }}>
                                However, navigating the modern textile market to find genuine, durable, and comfortable home goods can be overwhelming for consumers facing endless mass-produced options.
                            </p>
                            <p>
                                <strong style={{ color: 'var(--clr-text)' }}>Mohindra Handloom</strong> was founded to change this narrative.
                                We provide a curated platform featuring premium bedsheets, blankets, towels, and home accessories, ensuring fair prices and unmatched quality for every household.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ background: 'var(--clr-bg)', padding: '64px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', textAlign: 'center' }}>
                        {stats.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--clr-accent)', margin: '0 0 4px' }}>{s.number}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', letterSpacing: '0.04em', margin: 0 }}>{s.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section" style={{ background: 'var(--clr-surface)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 className="section-title" style={{ display: 'inline-block' }}>Our Values</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="card"
                                style={{ padding: '32px', textAlign: 'center' }}
                            >
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '14px',
                                    background: 'var(--clr-accent-light)',
                                    color: 'var(--clr-accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}>
                                    {v.icon}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: '0 0 10px', color: 'var(--clr-text)' }}>{v.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                background: 'linear-gradient(135deg, var(--clr-accent) 0%, #D4734A 50%, #B8860B 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px var(--space-lg)' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#FFFFFF', margin: '0 0 16px' }}>
                        Elevate Your Home Today
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.65 }}>
                        Every purchase directly brings premium comfort and style to your living spaces.
                    </p>
                    <a href="/products" className="btn-primary" style={{
                        background: '#FFFFFF', color: 'var(--clr-accent)', textDecoration: 'none', padding: '14px 36px', fontSize: '0.9rem',
                    }}>
                        Browse Collection
                    </a>
                </div>
            </section>
        </div>
    );
}
