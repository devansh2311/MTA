import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart(null);
            return;
        }
        try {
            setLoading(true);
            const res = await cartAPI.getCart();
            setCart(res.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await cartAPI.addToCart(productId, quantity);
            setCart(res.data);
            toast.success('Added to cart!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add to cart');
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        try {
            const res = await cartAPI.updateItem(itemId, quantity);
            setCart(res.data);
        } catch (err) {
            toast.error('Failed to update cart');
        }
    };

    const removeCartItem = async (itemId) => {
        try {
            const res = await cartAPI.removeItem(itemId);
            setCart(res.data);
            toast.success('Removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            const res = await cartAPI.clearCart();
            setCart(res.data);
            toast.success('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
        }
    };

    const cartItemCount = cart?.total_items || 0;
    const cartTotal = cart?.total_price || 0;

    return (
        <CartContext.Provider value={{
            cart, loading, cartItemCount, cartTotal,
            addToCart, updateCartItem, removeCartItem, clearCart, fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
