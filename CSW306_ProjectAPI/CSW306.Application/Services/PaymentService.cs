using CSW306.Application.DTO;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Payments>> GetAllPaymentsAsync()
        {
            return await _unitOfWork.Payments.GetAllAsync();
        }

        public async Task<Payments?> GetPaymentByIdAsync(int id)
        {
            return await _unitOfWork.Payments.GetByIdAsync(id);
        }

        public async Task<(Payments? Payment, string? ErrorMessage)> CreatePaymentAsync(PaymentResponseDTO paymentRes)
        {
            var exists = await _unitOfWork.Payments.GetByIdAsync(paymentRes.PaymentId);
            if (exists != null)
            {
                return (null, $"PaymentId {paymentRes.PaymentId} already exists");
            }

            var payment = new Payments
            {
                PaymentId = paymentRes.PaymentId,
                OrderId = paymentRes.OrderId,
                Amount = paymentRes.Amount,
                PaymentMethod = paymentRes.PaymentMethod,
                CreatedDate = DateTime.Now,
                Status = "unpaid"
            };

            await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            return (payment, null);
        }

        public async Task<(Payments? Payment, string? ErrorMessage)> UpdatePaymentAsync(int id, Payments updatedPayment)
        {
            if (id != updatedPayment.PaymentId) return (null, "ID mismatch");

            var existing = await _unitOfWork.Payments.GetByIdAsync(id);
            if (existing == null) return (null, "Payment not found");

            existing.OrderId = updatedPayment.OrderId;
            existing.Amount = updatedPayment.Amount;
            existing.PaymentMethod = updatedPayment.PaymentMethod;
            existing.Status = updatedPayment.Status;

            await _unitOfWork.Payments.UpdateAsync(existing);
            await _unitOfWork.SaveChangesAsync();

            return (existing, null);
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            var existing = await _unitOfWork.Payments.GetByIdAsync(id);
            if (existing == null) return false;

            await _unitOfWork.Payments.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Success, string Message, int TotalQuantity, decimal DiscountApplied, decimal TotalAmountToPay, decimal PaidAmount, decimal Change)> ProcessPaymentAsync(int id)
        {
            var payment = await _unitOfWork.Payments.GetByIdAsync(id);
            if (payment == null)
            {
                return (false, "Payment not found.", 0, 0, 0, 0, 0);
            }

            if (payment.Status != null && payment.Status.Equals("paid"))
            {
                return (false, "Payment has paid", 0, 0, 0, 0, 0);
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(payment.OrderId);
            if (order == null)
            {
                return (false, "Order not found.", 0, 0, 0, 0, 0);
            }

            decimal totalAmount = 0;
            int totalQuantity = 0;

            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    totalAmount += item.PriceAtOrder * item.Quantity;
                    totalQuantity += item.Quantity;
                }
            }

            decimal discountAmount = 0;

            if (order.DiscountId != null)
            {
                var discount = await _unitOfWork.Discounts.GetByIdAsync(order.DiscountId.Value);
                if (discount != null)
                {
                    if (discount.type.Equals("fixed"))
                    {
                        discountAmount += discount.value;
                    }
                    else if (discount.type.Equals("percentage"))
                    {
                        discountAmount += totalAmount * (discount.value / 100m);
                    }

                    totalAmount -= discountAmount;
                }
            }

            if (payment.Amount < totalAmount)
            {
                return (false, "Not enough money.", 0, 0, totalAmount, payment.Amount, totalAmount - payment.Amount);
            }

            decimal change = payment.Amount - totalAmount;
            order.Status = 3;
            payment.Status = "paid";
            
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.Payments.UpdateAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            return (true, "Payment successful.", totalQuantity, discountAmount, totalAmount, payment.Amount, change);
        }
    }
}
