using CSW306.Domain.Entities;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Orders>
    {
        Task<IEnumerable<Orders>> GetByDateRange(DateTime? start_date, DateTime? end_date);
    }
}
