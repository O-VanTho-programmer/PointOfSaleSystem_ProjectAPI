export enum OrderStatus {
    Pending = 0,   // Chef manages
    Complete = 1,  // Chef manages, Cashier can see
    Paid = 2       // Cashier manages
}
