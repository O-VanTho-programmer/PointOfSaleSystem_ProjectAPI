using CSW306.Application.DTO.Response;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class PaymentTransactionService : IPaymentTransactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PaymentTransactionService(IUnitOfWork unitOfWork) {
            _unitOfWork = unitOfWork;
        }
        public async Task<TemplateApi<PaymentTransaction>> GetPaymentTransactionByReferenceCode(string referenceCode)
        {
             var tran = await _unitOfWork.PaymentTransaction.GetPaymentTransactionByReferenceCodeAsync(referenceCode);

            if (tran == null) {
                return new TemplateApi<PaymentTransaction>(null, null, $"No transaction found by referenceCode: {referenceCode}.", false, 0, 0, 0, 0);
            }

            return new Pagination().HandleGetByIdRespond(tran);
        }

        public async Task<TemplateApi<PaymentTransaction>> GetPaymentTransactionsByOrderId(int orderId)
        {
            var trans = await _unitOfWork.PaymentTransaction.GetByOrderIdAsync(orderId);
            
            if (trans == null)
            {
                return new TemplateApi<PaymentTransaction>(null, null, $"No transaction found by orderId: {orderId}.", false, 0, 0, 0, 0);
            }

            return new Pagination().HandleGetAllRespond(0, trans.Count(), trans, trans.Count());
        }
    }
}
