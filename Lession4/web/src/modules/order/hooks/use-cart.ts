import { useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    variantId: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
}

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const loadCart = useCallback(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        loadCart();

        const handleStorage = () => loadCart();
        window.addEventListener("cart-updated", handleStorage);
        return () => window.removeEventListener("cart-updated", handleStorage);
    }, [loadCart]);

    const saveCart = (items: CartItem[]) => {
        localStorage.setItem("cart", JSON.stringify(items));
        setCartItems(items);
        window.dispatchEvent(new Event("cart-updated"));
    };

    const addToCart = (item: Omit<CartItem, 'id'>) => {
        const cartId = `${item.productId}-${item.variantId}`;
        const existingItemIndex = cartItems.findIndex(i => i.id === cartId);

        let newItems: CartItem[];
        if (existingItemIndex !== -1) {
            newItems = [...cartItems];
            newItems[existingItemIndex].quantity += item.quantity;
        } else {
            newItems = [...cartItems, { ...item, id: cartId }];
        }
        saveCart(newItems);
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        const newItems = cartItems.map(item =>
            item.id === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        saveCart(newItems);
    };

    const removeItem = (cartId: string) => {
        const newItems = cartItems.filter(item => item.id !== cartId);
        saveCart(newItems);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
        cartItems,
        totalCount,
        totalPrice,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        reloadCart: loadCart
    };
}
