"use client";

import React, { useState } from 'react';
import { OrderStatus, OrderType, OrderResponseDTO, PaymentStatus, KitchenStatus } from '@/types/OrderDTO';
import { RoleGuard } from '@/components/RoleGuard';
import { formatServerTimeOnly, getTodayDateRange } from '@/utils/dateHelper';
import { useOrders, useUpdateOrderStatus, useUpdatePaymentStatus, useCompleteOrder, useUpdateKitchenStatus } from '@/hooks/useOrders';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { Pagination } from '@/components/inventory/Pagination';
import OrderCard from '@/components/order/OrderCard';
import LoadingState from '@/components/ui/LoadingState';
import { formatCurrency } from '@/utils/formatCurrency';
import { usePosSignalR } from '@/hooks/usePosSignalR';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const ORDER_TYPE_LABELS: Record<number, string> = {
    [OrderType.DineIn]: 'Dine-In',
    [OrderType.TakeAway]: 'Takeaway',
};

export const ORDER_STATUS_LABELS: Record<number, string> = {
    [OrderStatus.Cancelled]: 'Cancelled',
    [OrderStatus.Active]: 'Active',
    [OrderStatus.Completed]: 'Completed',
};

export const PAYMENT_STATUS_LABELS: Record<number, string> = {
    [PaymentStatus.Voided]: 'Voided',
    [PaymentStatus.Refunded]: 'Refunded',
    [PaymentStatus.Unpaid]: 'Unpaid',
    [PaymentStatus.Paid]: 'Paid',
};

export const KITCHEN_STATUS_LABELS: Record<number, string> = {
    [KitchenStatus.Cancelled]: 'Cancelled',
    [KitchenStatus.Pending]: 'Pending',
    [KitchenStatus.Cooking]: 'Cooking',
    [KitchenStatus.Ready]: 'Ready',
    [KitchenStatus.Served]: 'Served',
};

export default function OrdersPage() {
    usePosSignalR();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [{ startDate, endDate }, setDateRange] = useState(getTodayDateRange());

    const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');

    const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useOrders(pageNumber, pageSize, startDate, endDate, statusFilter == "All" ? undefined : statusFilter);
    const orders = ordersData?.listPayload ?? [];

    const [selectedOrder, setSelectedOrder] = useState<OrderResponseDTO | null>(null);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    const calculateTotal = (order: OrderResponseDTO) => {
        const subtotal = order.orderItems.reduce((sum, oi) => sum + (oi.priceAtOrder * oi.quantity), 0);
        return subtotal * 1.10;
    };

    const updateOrderStatus = useUpdateOrderStatus();
    const updatePaymentStatus = useUpdatePaymentStatus();
    const updateKitchenStatus = useUpdateKitchenStatus();
    const completeOrder = useCompleteOrder();

    const handleMarkPaid = () => {
        if (!selectedOrder) return;
        updatePaymentStatus.mutate({
            id: selectedOrder.orderId,
            dto: { paymentStatus: PaymentStatus.Paid }
        });
        setSelectedOrder(null);
    };

    const handleCompleteOrder = () => {
        if (!selectedOrder) return;
        completeOrder.mutate(selectedOrder.orderId);
        setSelectedOrder(null);
    };

    // Mark served and complete order
    const handleHandoverToCustomer = async () => {
        if (!selectedOrder) return;

        await updateKitchenStatus.mutateAsync({
            id: selectedOrder.orderId,
            dto: { kitchenStatus: KitchenStatus.Served }
        });

        await completeOrder.mutateAsync(selectedOrder.orderId);

        setSelectedOrder(null);
    };

    const handleCancelOrder = () => {
        setIsCancelConfirmOpen(true);
    };

    const confirmCancelOrder = () => {
        if (!selectedOrder) return;
        updateOrderStatus.mutate({
            id: selectedOrder.orderId,
            dto: { status: OrderStatus.Cancelled }
        });
        setIsCancelConfirmOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="flex h-full flex-col bg-slate-50 p-6 sm:p-8 overflow-y-auto">
            <header className="mb-2 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Orders</h1>
                    <p className="mt-2 text-slate-500">Manage order states and proceed to payment.</p>
                </div>

                {statusFilter === 'All' && (
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                            <span className="text-sm font-medium text-slate-600">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-400"></span>
                            <span className="text-sm font-medium text-slate-600">Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                            <span className="text-sm font-medium text-slate-600">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-400"></span>
                            <span className="text-sm font-medium text-slate-600">Cancelled</span>
                        </div>
                    </div>
                )}
            </header>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex rounded-lg bg-slate-200/50 p-1 w-fit border border-slate-200/60 shadow-inner">
                    <button
                        onClick={() => setStatusFilter('All')}
                        className={`rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap ${statusFilter === 'All' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter(OrderStatus.Active)}
                        className={`rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap ${statusFilter === OrderStatus.Active ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setStatusFilter(OrderStatus.Completed)}
                        className={`rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap ${statusFilter === OrderStatus.Completed ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setStatusFilter(OrderStatus.Cancelled)}
                        className={`rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap ${statusFilter === OrderStatus.Cancelled ? 'bg-white text-red-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Cancelled
                    </button>
                </div>

                <RoleGuard allowedRoles={['Manager']}>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDateRange(getTodayDateRange())}
                            className="bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 cursor-pointer rounded-md px-6 py-2 text-sm font-bold transition-all duration-200 touch-manipulation select-none whitespace-nowrap"
                        >
                            Today
                        </button>

                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            setDateRange={setDateRange}
                        />
                    </div>
                </RoleGuard>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoadingOrders && (
                    <LoadingState message="Loading orders..." />
                )}

                {!isLoadingOrders && !ordersError && (
                    orders.map(order => (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            setSelectedOrder={setSelectedOrder}
                            calculateTotal={calculateTotal}
                        />
                    ))
                )}

                {!isLoadingOrders && !ordersError && orders.length === 0 && (
                    <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                        <span className="text-lg font-medium text-slate-400">
                            {statusFilter === 'All' ? 'No orders found for this date' : `No ${ORDER_STATUS_LABELS[statusFilter]?.toLowerCase()} orders`}
                        </span>
                    </div>
                )}
            </div>

            <RoleGuard allowedRoles={['Manager']}>
                <Pagination
                    currentPage={pageNumber}
                    totalPages={ordersData?.totalPages ?? 0}
                    totalElement={ordersData?.totalElement ?? 0}
                    onPageChange={setPageNumber}
                />
            </RoleGuard>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity">
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className={`h-2 w-full ${selectedOrder.status === OrderStatus.Completed ? 'bg-emerald-500' :
                            selectedOrder.status === OrderStatus.Cancelled ? 'bg-red-500' :
                                selectedOrder.paymentStatus === PaymentStatus.Paid ? 'bg-blue-500' : 'bg-amber-500'
                            }`}></div>
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif text-3xl font-bold text-slate-900">Order #{selectedOrder.orderId}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Order Type</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedOrder.orderType !== undefined ? ORDER_TYPE_LABELS[selectedOrder.orderType] : '—'}
                                        {selectedOrder.tableNumber ? ` (Table ${selectedOrder.tableNumber})` : ''}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Order Status</span>
                                    <span className={`font-semibold ${selectedOrder.status === OrderStatus.Completed ? 'text-emerald-600' :
                                        selectedOrder.status === OrderStatus.Cancelled ? 'text-red-600' : 'text-amber-600'
                                        }`}>
                                        {ORDER_STATUS_LABELS[selectedOrder.status]}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Payment</span>
                                    <span className={`font-semibold ${selectedOrder.paymentStatus === PaymentStatus.Paid ? 'text-emerald-600' :
                                        selectedOrder.paymentStatus === PaymentStatus.Unpaid ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                        {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus]}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Kitchen</span>
                                    <span className={`font-semibold ${selectedOrder.kitchenStatus === KitchenStatus.Served || selectedOrder.kitchenStatus === KitchenStatus.Ready ? 'text-emerald-600' :
                                        selectedOrder.kitchenStatus === KitchenStatus.Cooking ? 'text-orange-600' : 'text-slate-600'
                                        }`}>
                                        {KITCHEN_STATUS_LABELS[selectedOrder.kitchenStatus]}
                                    </span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-sm font-medium text-slate-500">Total</span>
                                    <span className="font-mono text-xl font-bold text-slate-900">{formatCurrency(calculateTotal(selectedOrder))}</span>
                                </div>
                            </div>

                            {selectedOrder.status === OrderStatus.Active && (
                                <div className="mt-8 flex flex-col gap-3">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCancelOrder}
                                            className="flex-1 rounded-xl bg-white px-4 py-4 font-bold text-red-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-red-50 active:bg-red-100"
                                        >
                                            Cancel Order
                                        </button>
                                        <RoleGuard allowedRoles={['Manager', 'Cashier']}>
                                            {selectedOrder.paymentStatus !== PaymentStatus.Paid ? (
                                                <button
                                                    type="button"
                                                    onClick={handleMarkPaid}
                                                    className="flex-2 rounded-xl bg-slate-900 px-4 py-4 text-lg font-bold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg active:translate-y-0 active:bg-blue-700"
                                                >
                                                    Mark as Paid
                                                </button>
                                            ) : selectedOrder.orderType === OrderType.TakeAway ? (
                                                <button
                                                    type="button"
                                                    onClick={handleHandoverToCustomer}
                                                    disabled={selectedOrder.kitchenStatus !== KitchenStatus.Ready}
                                                    className="flex-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-lg active:translate-y-0 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-emerald-600"
                                                >
                                                    Handed to Customer
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleCompleteOrder}
                                                    disabled={
                                                        selectedOrder.kitchenStatus !== KitchenStatus.Served &&
                                                        selectedOrder.kitchenStatus !== KitchenStatus.Ready
                                                    }
                                                    className="flex-2 rounded-xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-lg active:translate-y-0 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-emerald-600"
                                                >
                                                    Complete Order
                                                </button>
                                            )}
                                        </RoleGuard>
                                    </div>
                                    {selectedOrder.paymentStatus === PaymentStatus.Paid &&
                                        selectedOrder.kitchenStatus !== KitchenStatus.Served &&
                                        selectedOrder.kitchenStatus !== KitchenStatus.Ready && (
                                            <p className="text-center text-xs text-slate-400">
                                                {selectedOrder.orderType === OrderType.TakeAway
                                                    ? "Takeaway order must be Ready in the kitchen before handoff."
                                                    : "Dine-In order must be Ready or Served in the kitchen before it can be completed."}
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isCancelConfirmOpen}
                onClose={() => setIsCancelConfirmOpen(false)}
                onConfirm={confirmCancelOrder}
                title="Cancel Order"
                description={`Are you sure you want to cancel order #${selectedOrder?.orderId}? This action cannot be undone.`}
                confirmText="Yes, cancel order"
                isDestructive={true}
                isLoading={updateOrderStatus.isPending}
            />
        </div>
    );
}
