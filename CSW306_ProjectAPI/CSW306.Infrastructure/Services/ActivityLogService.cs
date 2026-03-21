using CSW306.Application.Interfaces.IRepositories;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IActivityLogRepository _activityLogRepository;

        public ActivityLogService(IActivityLogRepository activityLogRepository)
        {
            _activityLogRepository = activityLogRepository;
        }

        public async Task<IEnumerable<ActivityLog>> GetAllActivitiesAsync()
        {
            return await _activityLogRepository.GetAllAsync();
        }

        public async Task<ActivityLog?> GetActivityByIdAsync(int activityId)
        {
            return await _activityLogRepository.GetByIdAsync(activityId);
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByUserIdAsync(int userId)
        {
            return await _activityLogRepository.GetActivitiesByUserIdAsync(userId);
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _activityLogRepository.GetActivitiesByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByEntityAsync(string entityName)
        {
            return await _activityLogRepository.GetActivitiesByEntityAsync(entityName);
        }
    }
}
