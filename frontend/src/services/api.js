import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const { access } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const tokens = JSON.parse(localStorage.getItem('tokens'));
                const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                    refresh: tokens.refresh,
                });
                const newTokens = { ...tokens, access: res.data.access };
                localStorage.setItem('tokens', JSON.stringify(newTokens));
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    customerRegister: (data) => api.post('/auth/register/', data),
    ownerRegister: (data) => api.post('/auth/owner/register/', data),
    login: (data) => api.post('/auth/login/', data),
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (data) => api.patch('/auth/profile/', data),
    getOwnerProfile: () => api.get('/auth/owner/profile/'),
    updateOwnerProfile: (data) => api.patch('/auth/owner/profile/', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products/', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}/`),
    getFeatured: () => api.get('/products/featured/'),
    getCategories: () => api.get('/products/categories/'),
    getCategoryBySlug: (slug) => api.get(`/products/categories/${slug}/`),
    getReviews: (productId) => api.get(`/products/${productId}/reviews/`),
    addReview: (productId, data) => api.post(`/products/${productId}/reviews/`, data),
    // Owner endpoints
    getOwnerProducts: () => api.get('/products/owner/my-products/'),
    createProduct: (data) => api.post('/products/owner/create/', data),
    updateProduct: (id, data) => api.put(`/products/owner/update/${id}/`, data),
    deleteProduct: (id) => api.delete(`/products/owner/delete/${id}/`),
    uploadImage: (productId, formData) =>
        api.post(`/products/owner/upload-image/${productId}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    deleteImage: (imageId) => api.delete(`/products/owner/delete-image/${imageId}/`),
    setImagePrimary: (imageId) => api.patch(`/products/owner/set-primary-image/${imageId}/`),
};

// Cart API
export const cartAPI = {
    getCart: () => api.get('/cart/'),
    addToCart: (productId, quantity = 1) =>
        api.post('/cart/add/', { product_id: productId, quantity }),
    updateItem: (itemId, quantity) =>
        api.put(`/cart/update/${itemId}/`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/remove/${itemId}/`),
    clearCart: () => api.delete('/cart/clear/'),
    getWishlist: () => api.get('/cart/wishlist/'),
    addToWishlist: (productId) =>
        api.post('/cart/wishlist/add/', { product_id: productId }),
    removeFromWishlist: (itemId) => api.delete(`/cart/wishlist/remove/${itemId}/`),
};

// Orders API
export const ordersAPI = {
    createOrder: (data) => api.post('/orders/create/', data),
    getOrders: () => api.get('/orders/'),
    getOrderDetail: (id) => api.get(`/orders/${id}/`),
    verifyPayment: (data) => api.post('/orders/verify-payment/', data),
    getOwnerOrders: () => api.get('/orders/owner/'),
    getOwnerStats: () => api.get('/orders/owner/stats/'),
    getOwnerCustomers: () => api.get('/orders/owner/customers/'),
    updateOrderStatus: (id, status) =>
        api.put(`/orders/owner/${id}/status/`, { status }),
};

// Contact API
export const contactAPI = {
    sendMessage: (data) => api.post('/contact/', data),
    getOwnerMessages: () => api.get('/contact/owner/messages/'),
};

export default api;
