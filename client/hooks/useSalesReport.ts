import { useQuery } from '@tanstack/react-query';
import { getDashboardSalesReport } from '../services/salesReport';
import { TemplateApi } from '../types/Item';
import { SaleReportDTO } from '../types/SalesReport';

export const useDashboardSalesReport = (startDate?: string, endDate?: string) => {
    return useQuery<TemplateApi<SaleReportDTO>, Error>({
        queryKey: ['salesReport', startDate, endDate],
        queryFn: () => getDashboardSalesReport(startDate, endDate),
    });
};
