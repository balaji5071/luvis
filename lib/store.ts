import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
};

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) =>
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.productId === item.productId && i.size === item.size
                    );

                    if (existingItemIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += item.quantity;
                        return { items: newItems };
                    }
                    return { items: [...state.items, item] };
                }),
            removeFromCart: (productId, size) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.productId === productId && item.size === size)
                    ),
                })),
            updateQuantity: (productId, size, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId && item.size === size
                            ? { ...item, quantity }
                            : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
            getCartCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'luvis-cart-storage',
        }
    )
);
