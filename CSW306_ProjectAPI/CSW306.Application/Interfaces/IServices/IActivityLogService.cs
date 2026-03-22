using CSW306.Domain.Entities;
using CSW306.Application.Utils;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IActivityLogService
    {
        Task<TemplateApi<ActivityLog>> GetAllActivitiesAsync(int pageNumber, int pageSize, DateTime? start_date, DateTime? end_date);
        Task<TemplateApi<ActivityLog>?> GetActivityByIdAsync(int activityId);
        Task<TemplateApi<ActivityLog>> GetActivitiesByUserIdAsync(int userId);
        Task<TemplateApi<ActivityLog>> GetActivitiesByEntityAsync(string entityName);
    }
}
