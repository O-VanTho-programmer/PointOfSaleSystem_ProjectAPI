using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CSW306.Infrastructure.Repositories
{
    public class OrderRepository : GenericRepository<Orders>, IOrderRepository
    {
        public OrderRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Orders>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date)
        {
            start_date ??= new DateTime(DateTime.Now.Year, 1, 1);
            end_date ??= new DateTime(DateTime.Now.Year, 12, 31);

            var orders = await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Item)
                .Where(o => o.CreatedDate >= start_date && o.CreatedDate <= end_date) .ToListAsync();

            return orders;
        }
    }
}