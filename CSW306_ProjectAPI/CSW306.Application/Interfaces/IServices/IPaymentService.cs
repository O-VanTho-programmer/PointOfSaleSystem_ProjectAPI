using CSW306.Application.DTO;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payments>> GetAllPaymentsAsync();
        Task<Payments?> GetPaymentByIdAsync(int id);
        Task<(Payments? Payment, string? ErrorMessage)> CreatePaymentAsync(PaymentResponseDTO paymentRes);
        Task<(Payments? Payment, string? ErrorMessage)> UpdatePaymentAsync(int id, Payments updatedPayment);
        Task<bool> DeletePaymentAsync(int id);
        
        Task<(bool Success, string Message, int TotalQuantity, decimal DiscountApplied, decimal TotalAmountToPay, decimal PaidAmount, decimal Change)> ProcessPaymentAsync(int id);
    }
}
