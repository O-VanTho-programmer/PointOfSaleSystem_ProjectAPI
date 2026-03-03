import { create } from 'zustand';
import { OrderItem } from '../models/Order';
import { MenuItemDTO } from '../types/MenuItemDTO';
import { OrderDTO, OrderType } from '../types/OrderDTO';
import { OrderStatus } from '../types/OrderStatus';

interface PosState {
    order: OrderDTO;
    setOrderType: (type: OrderType) => void;
    setTableNumber: (table: number | undefined) => void;
    addItem: (item: MenuItemDTO) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearOrder: () => void;
}

const createEmptyOrder = (): OrderDTO => ({
    id: 0,
    userId: 1, // Mock user ID for now
    status: OrderStatus.Pending,
    orderType: 'Dine-In',
    tableNumber: undefined,
    createdDate: new Date().toISOString(),
    items: [],
});

export const usePosStore = create<PosState>((set) => ({
    order: createEmptyOrder(),

    setOrderType: (type) =>
        set((state) => ({
            order: {
                ...state.order,
                orderType: type,
                tableNumber: type === 'Takeaway' ? undefined : state.order.tableNumber,
            },
        })),

    setTableNumber: (table) =>
        set((state) => ({ order: { ...state.order, tableNumber: table } })),

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
