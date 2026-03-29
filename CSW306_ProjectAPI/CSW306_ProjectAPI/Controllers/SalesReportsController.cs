using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CSW306.Application.DTO.Response;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Manager")]
    public class SalesReportsController : ControllerBase
    {
        private readonly ISaleReportService _saleReportService;

        public SalesReportsController(ISaleReportService saleReportService)
        {
            _saleReportService = saleReportService;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<TemplateApi<SaleReportDTO>>> GetDashboardSaleReport(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate)
        {
            // Default to last 30 days
            var end = endDate ?? DateTime.UtcNow;
            var start = startDate ?? end.AddDays(-30);

            var result = await _saleReportService.GetDashboardSaleReport(start, end);
            return Ok(result);
        }
    }
}
