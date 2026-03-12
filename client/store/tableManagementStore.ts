import { create } from 'zustand';
import { TableStatus } from '../types/Table';

export type ModalMode = "table" | "reservation";

interface TableManagementState {
    isOpen: boolean;
    mode: ModalMode;
    
    // Table Form
    tableId: string;
    capacity: string;
    status: TableStatus;
    
    // Reservation Form
    resTableId: string;
    resName: string;
    resGuests: string;
    resDate: string;
    resTime: string;
    resNote: string;

    // Actions
    setIsOpen: (isOpen: boolean) => void;
    setMode: (mode: ModalMode) => void;
    
    setTableField: (field: keyof Pick<TableManagementState, 'tableId' | 'capacity' | 'status'>, value: string) => void;
    setReservationField: (field: keyof Pick<TableManagementState, 'resTableId' | 'resName' | 'resGuests' | 'resDate' | 'resTime' | 'resNote'>, value: string) => void;
    
    resetTableForm: () => void;
    resetReservationForm: () => void;
    resetAll: () => void;
}

const initialState = {
    isOpen: false,
    mode: "table" as ModalMode,
    
    tableId: "",
    capacity: "",
    status: "available" as TableStatus,
    
    resTableId: "",
    resName: "",
    resGuests: "",
    resDate: "",
    resTime: "",
    resNote: "",
};

export const useTableManagementStore = create<TableManagementState>((set) => ({
    ...initialState,
    
    setIsOpen: (isOpen) => set({ isOpen }),
    setMode: (mode) => set({ mode }),
    
    setTableField: (field, value) => set((state) => ({ ...state, [field]: value })),
    setReservationField: (field, value) => set((state) => ({ ...state, [field]: value })),
    
    resetTableForm: () => set({
        tableId: "",
        capacity: "",
        status: "available",
    }),
    
    resetReservationForm: () => set({
        resTableId: "",
        resName: "",
        resGuests: "",
        resDate: "",
        resTime: "",
        resNote: "",
    }),
    
    resetAll: () => set({ ...initialState })
}));
