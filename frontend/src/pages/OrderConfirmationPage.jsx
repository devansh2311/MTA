import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineClipboardList } from 'react-icons/hi';

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // check state for details
        if (location.state && location.state.orderSuccess) {
            setOrderDetails(location.state);
        } else {
            // direct access without state, redirect to home
            navigate('/', { replace: true });
        }

        return () => clearInterval(interval);
    }, [location, navigate]);

    if (!orderDetails) return null;

    return (
        <div style={{ background: 'var(--clr-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="card"
                style={{ maxWidth: '480px', width: '100%', padding: '48px 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                    style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--clr-success)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px', boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.1)'
                    }}
                >
                    <HiOutlineCheckCircle size={48} />
                </motion.div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--clr-text)', margin: '0 0 12px' }}>
                    Order Confirmed!
                </h1>

                <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
                    Thank you for your purchase. We've received your order and will begin processing it right away.
                </p>

                <div style={{ background: 'var(--clr-bg-alt)', borderRadius: 'var(--radius-md)', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--clr-text-muted)', margin: '0 0 12px', fontWeight: 600 }}>
                        Order Summary
                    </p>

                    {orderDetails.totalAmount && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--clr-border)' }}>
                            <span style={{ color: 'var(--clr-text)' }}>Total Amount</span>
                            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--clr-text)' }}>
                                ₹{Number(orderDetails.totalAmount).toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--clr-text-secondary)', fontSize: '0.85rem' }}>
                        <span>📍</span>
                        <span>We will send updates to your registered email or phone number.</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/orders" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
                        <HiOutlineClipboardList size={18} /> View Order Details
                    </Link>
                    <Link to="/products" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'transparent', color: 'var(--clr-text)', border: '1px solid var(--clr-border)' }}>
                        <HiOutlineShoppingBag size={18} /> Continue Shopping
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
