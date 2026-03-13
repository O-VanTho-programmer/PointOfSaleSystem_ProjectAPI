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
    tableNumber?: number;
    orderType?: OrderType;
    orderItems: OrderItemDTO[];
}

export interface OrderItemDTO {
    itemId: number;
    quantity: number;
    priceAtOrder: number;
}

export interface OrdersUploadDTO {
    userId: number;
    status: number;
    orderItems: OrderItemUploadDTO[];
    tableNumber?: number;
    orderType?: number;
    discountId?: number;
    createdDate: string;
}

export interface OrderItemUploadDTO {
    itemId: number;
    quantity: number;
    priceAtOrder: number;
}
export interface UpdateStatusOrderDTO {
    status: number;
}
