export enum OrderType {
    DineIn = 0,
    TakeAway = 1,
    Delivery = 2,
}

export enum OrderStatus {
    Cancelled = -1,
    Pending = 0,
    Complete = 1,
    Paid = 2,
}

export interface OrderDTO {
    orderId: number;
    userId?: number;
    discountId?: number;
    status: OrderStatus;
    createdDate: string;
    tableNumber?: string;
    orderType?: OrderType;
    orderItems: OrderItemDTO[];
}

export interface OrderItemDTO {
    itemId: number;
    quantity: number;
    priceAtOrder: number;
}

export interface OrdersUploadDTO {
    status: number;
    discountId: number;
    userId: number;
    items: OrderItemUploadDTO[];
    createdDate: string;
    tableNumber?: string;
    orderType?: number;
}

export interface OrderItemUploadDTO {
    itemId: number;
    quantity: number;
}
export interface UpdateStatusOrderDTO {
    status: number;
}
