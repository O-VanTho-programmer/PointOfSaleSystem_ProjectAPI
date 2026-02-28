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
            start_date ??= new DateTime(DateTime.Now.Year, 1, 1);
            end_date ??= new DateTime(DateTime.Now.Year, 12, 31);

            return await _dbSet
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Where(o => o.CreatedDate >= start_date && o.CreatedDate <= end_date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Orders>> GetAllOrdersWithDetailsAsync(int pageNumber, int pageSize)
        {
            return await _dbSet
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
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

        public async Task<int> GetTotalOrdersCountAsync()
        {
            return await _dbSet.CountAsync();
        }
    }
}