using CSW306.Application.DTO.Response;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IPaymentTransactionService
    {
        Task<TemplateApi<PaymentTransaction>> GetPaymentTransactionByReferenceCode(string referenceCode);
        Task<TemplateApi<PaymentTransaction>> GetPaymentTransactionsByOrderId(int orderId);
    }
}
