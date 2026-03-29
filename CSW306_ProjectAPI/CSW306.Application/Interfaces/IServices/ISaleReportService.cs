using CSW306.Application.DTO.Response;
using CSW306.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface ISaleReportService
    {
        Task<TemplateApi<SaleReportDTO>> GetDashboardSaleReport(DateTime startDate, DateTime endDate);
    }
}
