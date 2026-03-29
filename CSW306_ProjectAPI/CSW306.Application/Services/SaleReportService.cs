using CSW306.Application.DTO.Response;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class SaleReportService : ISaleReportService
    {
        private readonly IUnitOfWork _unitOfWork;
        public SaleReportService(IUnitOfWork unitOfWork) 
        { 
            _unitOfWork = unitOfWork;
        }

        public async Task<TemplateApi<SaleReportDTO>> GetDashboardSaleReport(DateTime startDate, DateTime endDate)
        {
            var metrics = await _unitOfWork.SalesReports.GetMetricsAsync(startDate, endDate);
            var topSellers = await _unitOfWork.SalesReports.GetTopSellersAsync(startDate, endDate, 5);
            var ordersChart = await _unitOfWork.SalesReports.GetOrdersByHourAsync(startDate, endDate);

            var report = new SaleReportDTO
            {
                Metrics = metrics,
                TopSellers = topSellers,
                OrdersByHour = ordersChart
            };

            var pagination = new Pagination();
            return new TemplateApi<SaleReportDTO>(report, null, "Sales report generated successfully", true, 0, 0, 0, 0);
        }
    }
}
