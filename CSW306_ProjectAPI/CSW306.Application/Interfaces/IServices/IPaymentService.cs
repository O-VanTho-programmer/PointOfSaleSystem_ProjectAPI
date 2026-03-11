using CSW306.Application.DTO;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IPaymentService
    {
        Task<TemplateApi<Payments>> GetAllPaymentsAsync();
        Task<TemplateApi<Payments>> GetPaymentByIdAsync(int id);
        Task<TemplateApi<Payments>> CreatePaymentAsync(PaymentResponseDTO paymentRes);
        Task<TemplateApi<Payments>> UpdatePaymentAsync(int id, Payments updatedPayment);
        Task<TemplateApi<Payments>> DeletePaymentAsync(int id);
        
        // Custom payload using anonymous object / dictionary or defining a new DTO (returning object)
        Task<TemplateApi<object>> ProcessPaymentAsync(int id);
    }
}
