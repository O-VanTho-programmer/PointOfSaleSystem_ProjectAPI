using CSW306.Application.DTO;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<TemplateApi<Payments>> GetAllPaymentsAsync()
        {
            try
            {
                var payments = await _unitOfWork.Payments.GetAllAsync();
                var countRecord = payments.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, payments, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Payments>(null, null, "An unexpected error occurred while fetching payments.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Payments>> GetPaymentByIdAsync(int id)
        {
            try
            {
                var payment = await _unitOfWork.Payments.GetByIdAsync(id);
                if (payment == null)
                {
                    return new TemplateApi<Payments>(null, null, "Payment not found", false, 0, 0, 0, 0);
                }
                return new Pagination().HandleGetByIdRespond(payment);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Payments>(null, null, "An unexpected error occurred while fetching payment.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Payments>> CreatePaymentAsync(PaymentResponseDTO paymentRes)
        {
            try
            {
                var exists = await _unitOfWork.Payments.GetByIdAsync(paymentRes.PaymentId);
                if (exists != null)
                {
                    return new TemplateApi<Payments>(null, null, $"PaymentId {paymentRes.PaymentId} already exists", false, 0, 0, 0, 0);
                }

                var payment = new Payments
                {
                    PaymentId = paymentRes.PaymentId,
                    OrderId = paymentRes.OrderId,
                    Amount = paymentRes.Amount,
                    PaymentMethod = paymentRes.PaymentMethod,
                    CreatedDate = DateTime.UtcNow,
                    Status = "unpaid"
                };

                await _unitOfWork.Payments.AddAsync(payment);
                await _unitOfWork.SaveChangesAsync();

                return new Pagination().HandleGetByIdRespond(payment);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Payments>(null, null, "An unexpected error occurred while creating payment.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Payments>> UpdatePaymentAsync(int id, Payments updatedPayment)
        {
            try
            {
                if (id != updatedPayment.PaymentId) return new TemplateApi<Payments>(null, null, "ID mismatch", false, 0, 0, 0, 0);

                var existing = await _unitOfWork.Payments.GetByIdAsync(id);
                if (existing == null) return new TemplateApi<Payments>(null, null, "Payment not found", false, 0, 0, 0, 0);

                existing.OrderId = updatedPayment.OrderId;
                existing.Amount = updatedPayment.Amount;
                existing.PaymentMethod = updatedPayment.PaymentMethod;
                existing.Status = updatedPayment.Status;

                await _unitOfWork.Payments.UpdateAsync(existing);
                await _unitOfWork.SaveChangesAsync();

                return new Pagination().HandleGetByIdRespond(existing);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Payments>(null, null, "An unexpected error occurred while updating payment.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Payments>> DeletePaymentAsync(int id)
        {
            try
            {
                var existing = await _unitOfWork.Payments.GetByIdAsync(id);
                if (existing == null) return new TemplateApi<Payments>(null, null, "Payment not found", false, 0, 0, 0, 0);

                await _unitOfWork.Payments.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                return new TemplateApi<Payments>(existing, null, "Payment deleted successfully", true, 0, 0, 0, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Payments>(null, null, "An unexpected error occurred while deleting payment.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<object>> ProcessPaymentAsync(int id)
        {
            try
            {
                var payment = await _unitOfWork.Payments.GetByIdAsync(id);
                if (payment == null)
                {
                    return new TemplateApi<object>(null, null, "Payment not found.", false, 0, 0, 0, 0);
                }

                if (payment.Status != null && payment.Status.Equals("paid"))
                {
                    return new TemplateApi<object>(null, null, "Payment has paid", false, 0, 0, 0, 0); // Controller returns Ok for this, will adjust
                }

                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(payment.OrderId);
                if (order == null)
                {
                    return new TemplateApi<object>(null, null, "Order not found.", false, 0, 0, 0, 0);
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
                    return new TemplateApi<object>(new
                    {
                        TotalAmount = totalAmount,
                        PaidAmount = payment.Amount,
                        Shortage = totalAmount - payment.Amount
                    }, null, "Not enough money.", false, 0, 0, 0, 0);
                }

                decimal change = payment.Amount - totalAmount;
                order.Status = 3;
                payment.Status = "paid";

                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.Payments.UpdateAsync(payment);
                await _unitOfWork.SaveChangesAsync();

                return new TemplateApi<object>(new
                {
                    TotalQuantity = totalQuantity,
                    DiscountApplied = discountAmount,
                    TotalAmountToPay = totalAmount,
                    PaidAmount = payment.Amount,
                    Change = change
                }, null, "Payment successful.", true, 0, 0, 0, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<object>(null, null, "An unexpected error occurred while processing payment.", false, 0, 0, 0, 0);
            }
        }
    }
}
