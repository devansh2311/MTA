import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-bg)' }}>
            <LoadingSpinner size="lg" />
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;

    return children;
}

export function LoadingSpinner({ size = 'md', text = '' }) {
    const sizes = { sm: 20, md: 32, lg: 48 };
    const s = sizes[size] || sizes.md;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', minHeight: size === 'lg' ? '60vh' : 'auto' }}>
            <div style={{
                width: s, height: s,
                border: `3px solid var(--clr-border)`,
                borderTopColor: 'var(--clr-accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            {text && <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>{text}</p>}
        </div>
    );
}

export function StarRating({ rating, onRate, interactive = false, size = 16 }) {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <svg
                    key={star}
                    width={size} height={size}
                    viewBox="0 0 24 24"
                    fill={star <= rating ? 'var(--clr-gold-light)' : 'var(--clr-border)'}
                    style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.15s' }}
                    onClick={() => interactive && onRate && onRate(star)}
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

export function EmptyState({ title, message, action, actionLabel }) {
    return (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--clr-bg-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', fontSize: '2rem',
            }}>
                🔍
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 8px', color: 'var(--clr-text)' }}>{title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: '0 0 24px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>{message}</p>
            {action && <button onClick={action} className="btn-outline">{actionLabel || 'Go Back'}</button>}
        </div>
    );
}
