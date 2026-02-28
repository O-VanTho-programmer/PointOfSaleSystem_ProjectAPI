using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IRepositories;
using CSW306.Infrastructure.Data;
using CSW306.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CSW306.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CSW306_ProjectAPIContext _context;
        
         public IOrderRepository Orders { get; private set; } 
        // public IOrderItemRepository OrderItems { get; private set; } 
        public IItemRepository Items { get; private set; } 
        public ICategoryRepository Categories { get; private set; } 
        // public IDiscountRepository Discounts { get; private set; } 
        // public IPaymentRepository Payments { get; private set; } 
        // public IReservationRepository Reservations { get; private set; } 
        // public ITableRepository Tables { get; private set; } 
        public IUserRepository Users { get; private set; } 

        public UnitOfWork(CSW306_ProjectAPIContext context  )
        {
            _context = context;
            Orders = new OrderRepository(context);
            // OrderItems = new OrderItemRepository(context);
            Items = new ItemRepository(context);
            Categories = new CategoryRepository(context);
            // Discounts = new DiscountRepository(context);
            // Payments = new PaymentRepository(context);
            // Reservations = new ReservationRepository(context);
            // Tables = new TableRepository(context);
            Users = new UserRepository(context);
        }       

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}