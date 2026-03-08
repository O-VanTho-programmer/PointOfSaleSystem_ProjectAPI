import { create } from 'zustand';
import { MenuItemDTO } from '../types/MenuItemDTO';
import { OrderDTO, OrderType, OrderItemDTO } from '../types/OrderDTO';
import { OrderStatus } from '../types/OrderDTO';

interface PosState {
    order: OrderDTO;
    setOrderType: (type: OrderType) => void;
    setTableNumber: (table: string | undefined) => void;
    addItem: (item: MenuItemDTO) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearOrder: () => void;
}

const createEmptyOrder = (): OrderDTO => ({
    orderId: 0,
    userId: 1,
    status: OrderStatus.Pending,
    orderType: OrderType.DineIn,
    tableNumber: undefined,
    createdDate: new Date().toISOString(),
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
                (oi) => oi.itemId === menuItem.id
            );

            if (existingIndex >= 0) {
                const updated = [...state.order.orderItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                return { order: { ...state.order, orderItems: updated } };
            } else {
                const newItem: OrderItemDTO = {
                    itemId: menuItem.id,
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
