export interface SalesMetricsDto {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    itemsSold: number;
    revenueTrend: number;
    ordersTrend: number;
}

export interface ChartDataPointDto {
    label: string;
    value: number;
}

export interface TopSellerDto {
    itemName: string;
    quantitySold: number;
    totalRevenue: number;
}

export interface SaleReportDTO {
    metrics: SalesMetricsDto;
    revenueChart: ChartDataPointDto[];
    ordersChart: ChartDataPointDto[];
    topSellers: TopSellerDto[];
}
