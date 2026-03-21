using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IActivityLogRepository : IGenericRepository<ActivityLog>
    {
        Task<IEnumerable<ActivityLog>> GetActivitiesByUserIdAsync(int userId);
        Task<IEnumerable<ActivityLog>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ActivityLog>> GetActivitiesByEntityAsync(string entityName);
    }
}
