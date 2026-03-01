import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const res = await authAPI.login(credentials);
        const { user: userData, tokens, owner_profile } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        const fullUser = { ...userData, owner_profile };
        localStorage.setItem('user', JSON.stringify(fullUser));
        setUser(fullUser);
        return fullUser;
    };

    const customerRegister = async (data) => {
        const res = await authAPI.customerRegister(data);
        const { user: userData, tokens } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const ownerRegister = async (data) => {
        const res = await authAPI.ownerRegister(data);
        const { user: userData, tokens } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        setUser(null);
        toast.success("Successfully logged out");
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const refreshUser = async () => {
        try {
            const profileRes = await authAPI.getProfile();
            let fullUser = { ...profileRes.data };
            if (fullUser.role === 'owner') {
                try {
                    const ownerRes = await authAPI.getOwnerProfile();
                    fullUser.owner_profile = ownerRes.data;
                } catch (e) { /* no owner profile */ }
            }
            localStorage.setItem('user', JSON.stringify(fullUser));
            setUser(fullUser);
        } catch (e) { console.error('Failed to refresh user', e); }
    };

    const isAuthenticated = !!user;
    const isOwner = user?.role === 'owner';
    const isCustomer = user?.role === 'customer';

    return (
        <AuthContext.Provider value={{
            user, loading, login, customerRegister, ownerRegister,
            logout, updateUser, refreshUser, isAuthenticated, isOwner, isCustomer
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
