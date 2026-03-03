import { create } from 'zustand';
import { Order, OrderItem } from '../models/Order';
import { MenuItemDTO } from '../types/MenuItemDTO';

interface PosState {
    order: Order;
    addItem: (item: MenuItemDTO) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearOrder: () => void;
}

const createEmptyOrder = (): Order => ({
    id: 0,
    userId: 1, // Mock user ID for now
    status: 0, // Mock status (e.g., 0 = new, 1 = completed)
    createdDate: new Date().toISOString(),
    items: [],
});

export const usePosStore = create<PosState>((set) => ({
    order: createEmptyOrder(),

    addItem: (menuItem) =>
        set((state) => {
            const existingItemIndex = state.order.items.findIndex(
                (orderItem) => orderItem.item.id === menuItem.id
            );

            if (existingItemIndex >= 0) {
                // Increment quantity
                const updatedItems = [...state.order.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                };
                return { order: { ...state.order, items: updatedItems } };
            } else {
                // Add new item
                const newItem: OrderItem = {
                    quantity: 1,
                    priceAtOrder: menuItem.price,
                    item: menuItem,
                };
                return { order: { ...state.order, items: [...state.order.items, newItem] } };
            }
        }),

    removeItem: (itemId) =>
        set((state) => ({
            order: {
                ...state.order,
                items: state.order.items.filter((orderItem) => orderItem.item.id !== itemId),
            },
        })),

    updateQuantity: (itemId, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return {
                    order: {
                        ...state.order,
                        items: state.order.items.filter((orderItem) => orderItem.item.id !== itemId),
                    },
                };
            }
            return {
                order: {
                    ...state.order,
                    items: state.order.items.map((orderItem) =>
                        orderItem.item.id === itemId ? { ...orderItem, quantity } : orderItem
                    ),
                },
            };
        }),

    clearOrder: () => set({ order: createEmptyOrder() }),
}));
