using CSW306.Application.Interfaces.IRepositories;
using System;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
         IOrderRepository Orders { get; }
        // IOrderItemRepository OrderItems { get; }
        IItemRepository Items { get; }
        ICategoryRepository Categories { get; }
        IDiscountRepository Discounts { get; }
        IPaymentRepository Payments { get; }
        IReservationRepository Reservations { get; }
        ITableRepository Tables { get; }
        IUserRepository Users { get; }
        IActivityLogRepository ActivityLogs { get; }
        Task<int> SaveChangesAsync();
    }
}