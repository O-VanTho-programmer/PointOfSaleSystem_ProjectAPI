export interface Reservation {
    reservationId: number;
    tableId: number;
    numberOfPeople: number;
    note: string;
    time: string; // ISO DateTime string
    date: string; // ISO DateTime string
    customerName: string;
}

export interface ReservationCreateDTO {
    reservationId?: number;
    tableId: number;
    numberOfPeople: number;
    note: string;
    time: string | null;
    date: string | null;
    customerName: string;
}
