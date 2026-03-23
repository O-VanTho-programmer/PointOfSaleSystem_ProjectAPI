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
    public class OrderRepository : GenericRepository<Orders>, IOrderRepository
    {
        public OrderRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Orders>> GetByDateRange(DateTime? start_date, DateTime? end_date)
        {
            start_date ??= new DateTime(DateTime.UtcNow.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            end_date ??= new DateTime(DateTime.UtcNow.Year, 12, 31, 23, 59, 59, DateTimeKind.Utc);

            return await _dbSet
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Where(o => o.CreatedDate >= start_date && o.CreatedDate <= end_date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Orders>> GetAllOrdersWithDetailsAsync(int pageNumber, int pageSize, DateTime? startDate, DateTime? endDate, int? status = null)
        {
            startDate ??= new DateTime(DateTime.UtcNow.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            endDate ??= new DateTime(DateTime.UtcNow.Year, 12, 31, 23, 59, 59, DateTimeKind.Utc);

            var query = _dbSet
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Where(o => o.CreatedDate >= startDate && o.CreatedDate <= endDate);

            if (status.HasValue)
            {
                var statusEnum = (OrderStatus)status.Value;
                query = query.Where(o => o.Status == statusEnum);
            }

            return await query
                .OrderByDescending(o => o.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Orders?> GetOrderByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .FirstOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task<int> GetTotalOrdersCountAsync(DateTime? startDate = null, DateTime? endDate = null, int? status = null)
        {
            startDate ??= new DateTime(DateTime.UtcNow.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            endDate ??= new DateTime(DateTime.UtcNow.Year, 12, 31, 23, 59, 59, DateTimeKind.Utc);

            var query = _dbSet.Where(o => o.CreatedDate >= startDate && o.CreatedDate <= endDate);
            if (status.HasValue)
            {
                var statusEnum = (OrderStatus)status.Value;
                query = query.Where(o => o.Status == statusEnum);
            }

            return await query.CountAsync();
        }
    }
}