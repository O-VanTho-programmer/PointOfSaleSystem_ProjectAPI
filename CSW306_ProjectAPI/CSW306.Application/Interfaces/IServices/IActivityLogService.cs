using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IActivityLogService
    {
        Task<IEnumerable<ActivityLog>> GetAllActivitiesAsync();
        Task<ActivityLog?> GetActivityByIdAsync(int activityId);
        Task<IEnumerable<ActivityLog>> GetActivitiesByUserIdAsync(int userId);
        Task<IEnumerable<ActivityLog>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ActivityLog>> GetActivitiesByEntityAsync(string entityName);
    }
}
