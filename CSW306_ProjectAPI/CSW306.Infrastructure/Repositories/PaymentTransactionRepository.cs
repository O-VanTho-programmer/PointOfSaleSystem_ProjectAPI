using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Repositories
{
    public class PaymentTransactionRepository : GenericRepository<PaymentTransaction>, IPaymentTransactionRepository
    {
        public PaymentTransactionRepository(CSW306_ProjectAPIContext context): base(context) { }
        public async Task<IEnumerable<PaymentTransaction>> GetByOrderIdAsync(int orderId)
        {
            return await _dbSet.Where(t => t.OrderId == orderId).ToListAsync();
        }

        public async Task<PaymentTransaction?> GetPaymentTransactionByReferenceCodeAsync(string referenceCode)
        {
            var tran = await _dbSet.FirstOrDefaultAsync(t => t.ReferenceCode == referenceCode);
            return tran;
        }
    }
}
