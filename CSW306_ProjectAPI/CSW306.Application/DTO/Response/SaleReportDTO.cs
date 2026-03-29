using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CSW306.Application.DTO.Response
{
    public class SaleReportDTO
    {
        [JsonPropertyName("metrics")]
        public SalesMetricsDto Metrics { get; set; } = new();

        [JsonPropertyName("ordersByHour")]
        public List<ChartDataPointDto> OrdersByHour { get; set; } = new();

        [JsonPropertyName("topSellers")]
        public List<TopSellerDto> TopSellers { get; set; } = new();
    }

    public class SalesMetricsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal RevenueTrend { get; set; }
        
        public int TotalOrders { get; set; }
        public decimal OrdersTrend { get; set; } 
        
        public decimal AverageOrderValue { get; set; }
        public decimal AovTrend { get; set; }

        public int ItemsSold { get; set; }
        public decimal ItemsSoldTrend { get; set; } 
    }

    public class ChartDataPointDto
    {
        public string Label { get; set; } = string.Empty; // e.g., "8AM", "9AM"
        public int NumberOfOrder { get; set; }
    }

    public class TopSellerDto
    {
        public int Rank { get; set; }
        public string ItemName { get; set; }
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
