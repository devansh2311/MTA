import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ===================== 
   Customer Login
   ===================== */
export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ username: form.username, password: form.password });
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: '420px', padding: '48px 40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: '0 0 8px' }}>Welcome Back</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: 0 }}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Username</label>
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" placeholder="Enter username" required />
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Enter password" required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Create one</Link>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link to="/owner/login" style={{ fontSize: '0.75rem', color: 'var(--clr-text-light)', textDecoration: 'underline' }}>
                        Login as Shop Owner →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

/* ===================== 
   Customer Signup
   ===================== */
export function SignupPage() {
    const { customerRegister } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '', first_name: '', last_name: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await customerRegister({
                username: form.username,
                email: form.email,
                password: form.password,
                password2: form.confirm_password,
                first_name: form.first_name,
                last_name: form.last_name
            });
            toast.success('Account created! Welcome aboard.');
            navigate('/');
        } catch (err) {
            const errors = err.response?.data;
            toast.error(errors ? Object.values(errors).flat().join('. ') : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: '480px', padding: '48px 40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: '0 0 8px' }}>Create Account</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: 0 }}>Join the Mohindra Handloom community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>First Name</label>
                            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Last Name</label>
                            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field" required />
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Username</label>
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text)', marginBottom: '8px' }}>Confirm</label>
                            <input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} className="input-field" required />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
}

/* ===================== 
   Owner Login
   ===================== */
export function OwnerLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ username: form.username, password: form.password });
            toast.success('Welcome to your dashboard!');
            navigate('/owner/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(160deg, #1a1a1a 0%, #2C2C2C 50%, #3D2B1F 100%)',
            minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
        }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{
                width: '100%', maxWidth: '420px', padding: '48px 40px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(16px)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: 'var(--clr-accent)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px',
                    }}>🏪</div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#ffffff', margin: '0 0 8px' }}>Seller Portal</h1>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Access your shop dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Username</label>
                        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field"
                            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} placeholder="Enter username" required />
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field"
                            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} placeholder="Enter password" required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                        {loading ? 'Signing in...' : 'Access Dashboard'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    New seller? <Link to="/owner/signup" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Register your shop</Link>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link to="/login" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'underline' }}>← Back to Customer Login</Link>
                </div>
            </motion.div>
        </div>
    );
}

/* ===================== 
   Owner Signup
   ===================== */
export function OwnerSignupPage() {
    const { ownerRegister } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '', email: '', password: '', confirm_password: '',
        first_name: '', last_name: '', shop_name: '', shop_description: '', gst_number: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await ownerRegister({
                username: form.username,
                email: form.email,
                password: form.password,
                password2: form.confirm_password,
                first_name: form.first_name,
                last_name: form.last_name,
                shop_name: form.shop_name,
                shop_description: form.shop_description,
                gst_number: form.gst_number
            });
            toast.success('Shop registered! Welcome to Mohindra Handloom.');
            navigate('/owner/dashboard');
        } catch (err) {
            const errors = err.response?.data;
            toast.error(errors ? Object.values(errors).flat().join('. ') : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(160deg, #1a1a1a 0%, #2C2C2C 50%, #3D2B1F 100%)',
            minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
        }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{
                width: '100%', maxWidth: '560px', padding: '48px 40px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(16px)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#ffffff', margin: '0 0 8px' }}>Register Your Shop</h1>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Join our marketplace as a seller</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>First Name</label>
                            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Last Name</label>
                            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Username</label>
                            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Shop Name</label>
                        <input value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} className="input-field"
                            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} placeholder="Your business name" required />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Shop Description</label>
                        <textarea value={form.shop_description} onChange={(e) => setForm({ ...form, shop_description: e.target.value })} className="input-field"
                            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} rows="2" placeholder="Tell customers about your craft"></textarea>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>GST Number (optional)</label>
                        <input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} className="input-field"
                            style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Confirm</label>
                            <input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} className="input-field"
                                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                        {loading ? 'Registering...' : 'Register Shop'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    Already have a shop? <Link to="/owner/login" style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
}
