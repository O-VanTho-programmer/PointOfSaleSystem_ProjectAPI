import { create } from 'zustand';
import { OrderType, OrderItemUploadDTO, OrdersUploadDTO, OrderStatus } from '../types/OrderDTO';
import { Item } from '@/types/Item';

interface PosState {
    order: OrdersUploadDTO;
    setOrderType: (type: OrderType) => void;
    setTableNumber: (table: number | undefined) => void;
    addItem: (item: Item) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearOrder: () => void;
}

const createEmptyOrder = (): OrdersUploadDTO => ({
    userId: -1,
    status: OrderStatus.Active,
    orderType: OrderType.DineIn,
    tableNumber: undefined,
    discountId: undefined,
    orderItems: [],
});

export const usePosStore = create<PosState>((set) => ({
    order: createEmptyOrder(),

    setOrderType: (type) =>
        set((state) => ({
            order: {
                ...state.order,
                orderType: type,
                tableNumber: type === OrderType.TakeAway ? undefined : state.order.tableNumber,
            },
        })),

    setTableNumber: (table) =>
        set((state) => ({ order: { ...state.order, tableNumber: table } })),

    addItem: (menuItem) =>
        set((state) => {
            const existingIndex = state.order.orderItems.findIndex(
                (oi) => oi.itemId === menuItem.itemId
            );

            if (existingIndex >= 0) {
                const updated = [...state.order.orderItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                return { order: { ...state.order, orderItems: updated } };
            } else {
                const newItem: OrderItemUploadDTO = {
                    itemId: menuItem.itemId,
                    quantity: 1,
                    priceAtOrder: menuItem.price,
                };
                return { order: { ...state.order, orderItems: [...state.order.orderItems, newItem] } };
            }
        }),

    removeItem: (itemId) =>
        set((state) => ({
            order: {
                ...state.order,
                orderItems: state.order.orderItems.filter((oi) => oi.itemId !== itemId),
            },
        })),

    updateQuantity: (itemId, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return {
                    order: {
                        ...state.order,
                        orderItems: state.order.orderItems.filter((oi) => oi.itemId !== itemId),
                    },
                };
            }
            return {
                order: {
                    ...state.order,
                    orderItems: state.order.orderItems.map((oi) =>
                        oi.itemId === itemId ? { ...oi, quantity } : oi
                    ),
                },
            };
        }),

    clearOrder: () => set({ order: createEmptyOrder() }),
}));
