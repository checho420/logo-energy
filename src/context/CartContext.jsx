import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUI } from './UIContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { showToast } = useUI();
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return [];

            // Map old properties if they exist and filter out invalid items
            return parsed
                .filter(item => item && (item.id !== undefined || item.id !== null))
                .map(item => ({
                    ...item,
                    images: item.images || item.imagenes || [],
                    price: item.price || item.precio || 0,
                    quantity: item.quantity || 1
                }));
        } catch (error) {
            console.error("Cart load error:", error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                showToast(`+1 ${product.name} en el carrito`, 'info');
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            showToast(`${product.name} añadido al carrito`, 'success');
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const total = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
    const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

    const value = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        toggleCart
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount, isCartOpen, toggleCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

