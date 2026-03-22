using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Repositories
{
    public class ActivityLogRepository : GenericRepository<ActivityLog>, IActivityLogRepository
    {
        public ActivityLogRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByUserIdAsync(int userId)
        {
            return await _dbSet
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var startDateOffset = new DateTimeOffset(startDate.Date, TimeSpan.Zero);
            var endDateOffset = new DateTimeOffset(endDate.Date.AddDays(1), TimeSpan.Zero);

            return await _dbSet
                .Where(a => a.Timestamp >= startDateOffset && a.Timestamp < endDateOffset)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesByEntityAsync(string entityName)
        {
            return await _dbSet
                .Where(a => a.EntityName == entityName)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetActivitiesAsync(DateTime startDate, DateTime endDate, int pageNumber = 1, int pageSize = 100)
        {
            var query = _dbSet
                .Where(log => log.Timestamp >= startDate && log.Timestamp <= endDate);

            return await query
                .OrderByDescending(log => log.Timestamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
