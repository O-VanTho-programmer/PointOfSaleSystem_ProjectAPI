using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IPaymentTransactionRepository : IGenericRepository<PaymentTransaction>
    {
        Task<PaymentTransaction?> GetPaymentTransactionByReferenceCodeAsync(string referenceCode);
        Task<IEnumerable<PaymentTransaction>> GetByOrderIdAsync(int orderId);
    }
}
