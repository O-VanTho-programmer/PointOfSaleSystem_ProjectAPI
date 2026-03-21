import React from "react";
import { toast } from "react-hot-toast";
import { Square, Users, Info } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { useTableManagementStore } from "@/store/tableManagementStore";
import { useCreateTable } from "@/hooks/useTables";
import { TableStatus } from "@/types/Table";

export function TableForm() {
    const { tableId, capacity, status, setTableField, resetTableForm, setIsOpen } = useTableManagementStore();
    const createTable = useCreateTable();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tableId || !capacity) {
            toast.error("Please fill in all table details.");
            return;
        }

        const id = parseInt(tableId);
        const cap = parseInt(capacity);

        if (isNaN(id) || id <= 0) {
            toast.error("Table ID must be a valid positive number.");
            return;
        }

        if (isNaN(cap) || cap <= 0) {
            toast.error("Capacity must be a valid positive number.");
            return;
        }

        const promise = createTable.mutateAsync({
            tableId: id,
            capacity: cap,
            status: status
        });

        toast.promise(promise, {
            loading: 'Creating table...',
            success: 'Table created successfully!',
            error: (err) => `Error: ${err?.message || 'Failed to create table'}`
        });

        try {
            await promise;
            resetTableForm();
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form id="table-form" onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <InputField
                label="Table Number (ID)"
                icon={Square}
                type="number"
                min="1"
                placeholder="E.g. 10"
                value={tableId}
                onChange={(e) => setTableField("tableId", e.target.value)}
                autoFocus
            />

            <InputField
                label="Seating Capacity"
                icon={Users}
                type="number"
                min="1"
                placeholder="E.g. 4"
                value={capacity}
                onChange={(e) => setTableField("capacity", e.target.value)}
            />

            <SelectField
                label="Initial Status"
                icon={Info}
                value={status}
                onChange={(e) => setTableField("status", e.target.value as TableStatus)}
                options={[
                    { value: 'available', label: 'Available (Empty)' },
                    { value: 'reserved', label: 'Reserved' },
                    { value: 'occupied', label: 'Occupied' },
                ]}
            />
        </form>
    );
}
