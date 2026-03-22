using CSW306.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CSW306.Presentation.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager")]
    [ApiController]
    public class ActivityLogsController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;
        public ActivityLogsController(IActivityLogService activityLogService) {
            _activityLogService = activityLogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWithFilter([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 100) { 
            var activityLogs = await _activityLogService.GetAllActivitiesAsync(pageNumber, pageSize, startDate, endDate);

            return Ok(activityLogs);
        }
    }
}
