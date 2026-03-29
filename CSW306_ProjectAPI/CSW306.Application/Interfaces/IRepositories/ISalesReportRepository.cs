using CSW306.Application.DTO.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface ISalesReportRepository
    {
        Task<SalesMetricsDto> GetMetricsAsync(DateTime startDate, DateTime endDate);
        Task<List<TopSellerDto>> GetTopSellersAsync(DateTime startDate, DateTime endDate, int limit = 5);
        Task<List<ChartDataPointDto>> GetOrdersByHourAsync(DateTime startDate, DateTime endDate);
    }
}
