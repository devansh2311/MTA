import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await contactAPI.sendMessage(form);
            toast.success('Message sent! We\'ll get back to you soon.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const contactInfo = [
        { icon: <HiOutlineLocationMarker size={22} />, title: 'Visit Us', value: 'Shop No. 1, 2 Shree Ganesh Cloth Market\nAmbala City, Haryana' },
        { icon: <HiOutlinePhone size={22} />, title: 'Call Us', value: '+91 9416114057' },
        { icon: <HiOutlineMail size={22} />, title: 'Email Us', value: 'Mohindrahandloom74@gmail.com' },
        { icon: <HiOutlineClock size={22} />, title: 'Working Hours', value: 'Mon – Sat: 10 AM – 7 PM' },
    ];

    return (
        <div>
            {/* Header */}
            <section style={{
                background: 'linear-gradient(160deg, #2C2C2C 0%, #1a1a1a 50%, #3D2B1F 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '64px var(--space-lg) 80px' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-accent)', fontWeight: 600, marginBottom: '16px' }}>
                            Get in Touch
                        </p>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', margin: '0 0 16px', fontWeight: 600 }}>
                            Contact Us
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '480px', margin: '0 auto' }}>
                            We'd love to hear from you. Send us a message or reach out through any channel.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section style={{ background: 'var(--clr-bg)', padding: '64px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                viewport={{ once: true }}
                                className="card"
                                style={{ padding: '28px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                            >
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    background: 'var(--clr-accent-light)', color: 'var(--clr-accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    {info.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', margin: '0 0 4px' }}>{info.title}</h4>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-secondary)', margin: 0, whiteSpace: 'pre-line', lineHeight: 1.55 }}>{info.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="section" style={{ background: 'var(--clr-surface)' }}>
                <div className="container" style={{ maxWidth: '640px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title" style={{ display: 'inline-block' }}>Send a Message</h2>
                    </div>

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card"
                        style={{ padding: '40px' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Email</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" required />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Subject</label>
                            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="How can we help?" required />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Message</label>
                            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" rows="5" placeholder="Your message..." required></textarea>
                        </div>

                        <button type="submit" disabled={sending} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </motion.form>
                </div>
            </section>
        </div>
    );
}
