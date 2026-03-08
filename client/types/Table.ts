export interface Table {
    tableId: number;
    capacity: number;
    status: TableStatus;
}

export interface TableCreateDTO {
    tableId: number;
    capacity: number;
    status: TableStatus;
}

export type TableStatus = 'available' | 'reserved' | 'occupied';