import { Item } from "./Item";

export interface Order {
    id: number;
    userId: number;
    status: number;
    discountId?: number;
    createdDate: string;
    items: OrderItem[];
}

export interface OrderItem {
    quantity: number;
    priceAtOrder: number;
    item: Item;
}