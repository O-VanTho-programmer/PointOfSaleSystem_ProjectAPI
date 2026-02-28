using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Orders>
    {
        Task<IEnumerable<Orders>> GetByDateRange(DateTime? start_date, DateTime? end_date);
        Task<Orders?> GetOrderByIdWithDetailsAsync(int id);
        Task<IEnumerable<Orders>> GetAllOrdersWithDetailsAsync(int pageNumber, int pageSize);
        Task<int> GetTotalOrdersCountAsync();
    }
}
