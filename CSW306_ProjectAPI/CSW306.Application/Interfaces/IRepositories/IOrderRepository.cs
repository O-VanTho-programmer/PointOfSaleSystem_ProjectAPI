using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Orders>
    {
        Task<IEnumerable<Orders>> GetByDateRange(DateTime? startDate, DateTime? endDate);
        Task<Orders?> GetOrderByIdWithDetailsAsync(int id);
        Task<IEnumerable<Orders>> GetAllOrdersWithDetailsAsync(int pageNumber, int pageSize, DateTime? startDate, DateTime? endDate, int? status = null);
        Task<int> GetTotalOrdersCountAsync(DateTime? startDate = null, DateTime? endDate = null, int? status = null);
        Task<IEnumerable<Orders>> GetAbandonedTakeawayOrdersAsync(DateTime curOffTime);
    }
}
