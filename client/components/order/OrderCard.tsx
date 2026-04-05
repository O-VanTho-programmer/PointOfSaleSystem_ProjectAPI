import { KITCHEN_STATUS_LABELS, ORDER_TYPE_LABELS, PAYMENT_STATUS_LABELS } from "@/app/(workplace)/(cashier)/orders/page";
import { OrderResponseDTO, PaymentStatus, KitchenStatus, OrderStatus } from "@/types/OrderDTO";
import { formatServerTimeOnly } from "@/utils/dateHelper";
import { formatUSD } from "@/utils/formatCurrency";

interface OrderCardProps {
    order: OrderResponseDTO;
    setSelectedOrder: (order: OrderResponseDTO) => void;
    calculateTotal: (order: OrderResponseDTO) => number;
}

export default function OrderCard({ order, setSelectedOrder, calculateTotal }: OrderCardProps) {
    const getOrderCardBorder = (order: OrderResponseDTO) => {
        if (order.status === OrderStatus.Cancelled) return 'border-red-200 hover:border-red-400';
        if (order.status === OrderStatus.Completed) return 'border-emerald-200 hover:border-emerald-400';
        if (order.paymentStatus === PaymentStatus.Paid) return 'border-blue-200 hover:border-blue-400';
        return 'border-amber-200 hover:border-amber-400';
    };

    const getOrderCardIndicator = (order: OrderResponseDTO) => {
        if (order.status === OrderStatus.Cancelled) return 'bg-red-400';
        if (order.status === OrderStatus.Completed) return 'bg-emerald-400';
        if (order.paymentStatus === PaymentStatus.Paid) return 'bg-blue-400';
        return 'bg-amber-400';
    };

    return (
        <button
            key={order.orderId}
            onClick={() => setSelectedOrder(order)}
            className={`
                            relative flex flex-col items-start overflow-hidden rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-all duration-200 
                            hover:-translate-y-1 hover:shadow-md active:translate-y-0
                            ${getOrderCardBorder(order)}
                        `}
        >
            {/* Status Indicator Band */}
            <div className={`absolute left-0 top-0 h-full w-1.5 ${getOrderCardIndicator(order)}`} />

            <div className="flex w-full items-start justify-between">
                <span className="font-mono text-lg font-bold text-slate-900">#{order.orderId}</span>
                <span className="font-mono text-sm font-medium text-slate-500">{formatServerTimeOnly(order.createdDate)}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {order.orderType !== undefined ? ORDER_TYPE_LABELS[order.orderType] : '—'}
                </span>
                {order.tableNumber && (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Table {order.tableNumber}
                    </span>
                )}
                {/* Payment badge */}
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${order.paymentStatus === PaymentStatus.Paid
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                    }`}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </span>
                {/* Kitchen badge */}
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${order.kitchenStatus === KitchenStatus.Served || order.kitchenStatus === KitchenStatus.Ready
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    : order.kitchenStatus === KitchenStatus.Cooking
                        ? 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20'
                        : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10'
                    }`}>
                    🍳 {KITCHEN_STATUS_LABELS[order.kitchenStatus]}
                </span>
            </div>

            <div className="mt-6 flex w-full items-end justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">{order.orderItems.length} items</span>
                <span className="font-mono text-xl font-bold text-emerald-600">{formatUSD(calculateTotal(order))}</span>
            </div>
        </button>
    )
}