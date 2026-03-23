using CSW306.Application.DTO.Upload;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IActivityLogRepository : IGenericRepository<ActivityLog>
    {
        Task<IEnumerable<ActivityLog>> GetActivitiesByUserIdAsync(int userId);
        Task<IEnumerable<ActivityLog>> GetActivitiesAsync(DateTime startDate, DateTime endDate, string entityName, int pageNumber = 1, int pageSize = 100);
        Task<IEnumerable<ActivityLog>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<ActivityLog>> GetActivitiesByEntityAsync(string entityName);
    }
}
