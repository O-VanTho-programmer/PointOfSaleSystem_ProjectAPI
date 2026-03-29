import apiClient from "@/lib/apiClient";
import { TemplateApi } from "@/types/Item";

export const generatePaymentQrAsync = async (orderId: number): Promise<TemplateApi<string>> => {
    const response = await apiClient.get<TemplateApi<string>>(`/Payments/${orderId}/generate-qr`);
    return response.data;
};
