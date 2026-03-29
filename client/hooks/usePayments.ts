import { useMutation } from "@tanstack/react-query";
import { generatePaymentQrAsync } from "@/services/payment";
import toast from "react-hot-toast";

export const useGeneratePaymentQr = () => {
    return useMutation({
        mutationFn: (orderId: number) => generatePaymentQrAsync(orderId),
        onError: (error) => {
            console.error(error);
            toast.error("Failed to generate payment QR");
        }
    });
};
