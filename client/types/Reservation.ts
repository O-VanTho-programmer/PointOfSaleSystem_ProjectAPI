export interface Reservation {
    reservationId: number;
    tableId: number;
    numberOfPeople: number;
    note: string;
    time: string; // ISO 8601 string from C# DateTime
    date: string; // ISO 8601 string from C# DateTime
    customerName: string;
}

export interface ReservationCreateDTO {
    reservationId?: number; // Optional on create
    tableId: number;
    numberOfPeople: number;
    note: string;
    time: string;
    date: string;
    customerName: string;
}
