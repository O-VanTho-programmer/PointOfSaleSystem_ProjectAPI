export enum OrderType {
    DineIn = 0,
    TakeAway = 1,
}

export enum OrderStatus {
    Cancelled = -1,
    Active = 0,
    Completed = 1,
}

export enum PaymentStatus {
    Voided = -2,
    Refunded = -1,
    Unpaid = 0,
    Paid = 1,
}

export enum KitchenStatus {
    Cancelled = -1,
    Pending = 0,
    Cooking = 1,
    Ready = 2,
    Served = 3,
}

export interface OrderResponseDTO {
    orderId: number;
    orderNumber: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    kitchenStatus: KitchenStatus;
    discountId?: number;
    userId?: number;
    createdDate: string;
    tableNumber?: number;
    orderType?: OrderType;
    orderItems: OrderItemResponseDTO[];
}

export interface OrderItemResponseDTO {
    itemId: number;
    orderId: number;
    itemName?: string;
    quantity: number;
    priceAtOrder: number;
}

export interface OrdersUploadDTO {
    userId: number;
    status: OrderStatus;
    orderItems: OrderItemUploadDTO[];
    tableNumber?: number;
    orderType: OrderType;
    discountId?: number;
}

export interface OrderItemUploadDTO {
    itemId: number;
    quantity: number;
    priceAtOrder: number;
}

export interface UpdateStatusOrderDTO {
    status: OrderStatus;
}

export interface UpdatePaymentStatusDTO {
    paymentStatus: PaymentStatus;
}

export interface UpdateKitchenStatusDTO {
    kitchenStatus: KitchenStatus;
}
