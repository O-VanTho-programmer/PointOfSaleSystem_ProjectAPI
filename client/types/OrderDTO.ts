import { OrderItem } from '../models/Order';
import { OrderStatus } from './OrderStatus';

export type OrderType = 'Dine-In' | 'Takeaway';

export interface OrderDTO {
    id: number;
    userId: number;       // The employee who created the order
    status: OrderStatus;
    orderType: OrderType;
    tableNumber?: number; // Only for Dine-In
    discountId?: number;
    createdDate: string;
    items: OrderItem[];
}
