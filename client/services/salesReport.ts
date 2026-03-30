import apiClient from '../lib/apiClient';
import { TemplateApi } from '../types/Item';
import { SaleReportDTO } from '../types/SalesReport';

export const getDashboardSalesReport = async (
    startDate?: string,
    endDate?: string
): Promise<TemplateApi<SaleReportDTO>> => {
    const response = await apiClient.get<TemplateApi<SaleReportDTO>>('/SalesReports/dashboard', {
        params: { startDate, endDate },
    });
    return response.data;
};
