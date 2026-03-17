using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditLogService _auditLogService;

        public DiscountService(IUnitOfWork unitOfWork, IAuditLogService auditLogService)
        {
            _unitOfWork = unitOfWork;
            _auditLogService = auditLogService;
        }

        public async Task<TemplateApi<Discounts>> GetAllDiscountsAsync()
        {
            try
            {
                var discounts = await _unitOfWork.Discounts.GetAllAsync();
                var countRecord = discounts.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, discounts, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetAllDiscountsError", "Discount", null, null, $"Exception: {ex.Message}");
                return new TemplateApi<Discounts>(null, null, "An unexpected error occurred while fetching discounts.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Discounts>> GetDiscountByIdAsync(int id)
        {
            try
            {
                var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
                if (discount == null)
                {
                    return new TemplateApi<Discounts>(null, null, "Order Id not found", false, 0, 0, 0, 0);
                }
                return new Pagination().HandleGetByIdRespond(discount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetDiscountByIdError", "Discount", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Discounts>(null, null, "An unexpected error occurred while fetching the discount.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Discounts>> CreateDiscountAsync(Discounts discount)
        {
            try
            {
                var existing = await _unitOfWork.Discounts.GetByIdAsync(discount.DiscountId);
                if (existing != null)
                {
                    return new TemplateApi<Discounts>(null, null, $"DiscountId {discount.DiscountId} already exists", false, 0, 0, 0, 0);
                }

                await _unitOfWork.Discounts.AddAsync(discount);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("CreateDiscount", "Discount", discount.DiscountId, null, $"Code: {discount.DiscountCode}, Value: {discount.value}");

                return new Pagination().HandleGetByIdRespond(discount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("CreateDiscountError", "Discount", discount?.DiscountId, null, $"Exception: {ex.Message}");
                return new TemplateApi<Discounts>(null, null, "An unexpected error occurred while creating discount.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Discounts>> UpdateDiscountAsync(int id, Discounts updatedDiscount)
        {
            try
            {
                if (id != updatedDiscount.DiscountId)
                {
                    return new TemplateApi<Discounts>(null, null, "ID mismatch", false, 0, 0, 0, 0);
                }

                var existing = await _unitOfWork.Discounts.GetByIdAsync(id);
                if (existing == null)
                {
                    return new TemplateApi<Discounts>(null, null, "Discount not found", false, 0, 0, 0, 0);
                }

                existing.DiscountCode = updatedDiscount.DiscountCode;
                existing.value = updatedDiscount.value;
                existing.type = updatedDiscount.type;
                existing.minOrderAmount = updatedDiscount.minOrderAmount;
                existing.startDate = updatedDiscount.startDate;
                existing.endDate = updatedDiscount.endDate;

                await _unitOfWork.Discounts.UpdateAsync(existing);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("UpdateDiscount", "Discount", existing.DiscountId, null, $"Code: {existing.DiscountCode}, Value: {existing.value}");

                return new Pagination().HandleGetByIdRespond(existing);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("UpdateDiscountError", "Discount", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Discounts>(null, null, "An unexpected error occurred while updating discount.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Discounts>> DeleteDiscountAsync(int id)
        {
            try
            {
                var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
                if (discount == null) return new TemplateApi<Discounts>(null, null, "Discount not found", false, 0, 0, 0, 0);

                await _unitOfWork.Discounts.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("DeleteDiscount", "Discount", id, null, $"Deleted Discount {id}");

                return new TemplateApi<Discounts>(discount, null, "Discount deleted successfully", true, 0, 0, 0, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("DeleteDiscountError", "Discount", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Discounts>(null, null, "An unexpected error occurred while deleting discount.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<object>> IsDiscountValidAsync(int discountId, int orderId)
        {
            try
            {
                var discount = await _unitOfWork.Discounts.GetByIdAsync(discountId);
                if (discount == null)
                {
                    return new TemplateApi<object>(null, null, "Discount code not found.", false, 0, 0, 0, 0);
                }

                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(orderId);
                if (order == null)
                {
                    return new TemplateApi<object>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                var sumAmount = 0;
                if (order.OrderItems != null)
                {
                    foreach (var orderItem in order.OrderItems)
                    {
                        sumAmount += orderItem.Quantity;
                    }
                }

                if (sumAmount >= discount.minOrderAmount)
                {
                    order.DiscountId = discountId;
                    await _unitOfWork.Orders.UpdateAsync(order);
                    await _unitOfWork.SaveChangesAsync();

                    return new TemplateApi<object>(new
                    {
                        Applicable = true,
                        DiscountType = discount.type,
                        DiscountValue = discount.value
                    }, null, "Discount is applicable.", true, 0, 0, 0, 0);
                }

                return new TemplateApi<object>(new
                {
                    Applicable = false,
                    RequiredMinAmount = discount.minOrderAmount
                }, null, "Order total is less than the minimum required to apply this discount.", false, 0, 0, 0, 0); // Need to return false Success for negative evaluation but carrying payload
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("IsDiscountValidError", "Discount", discountId, null, $"Exception: {ex.Message}");
                return new TemplateApi<object>(null, null, "An unexpected error occurred while checking discount validity.", false, 0, 0, 0, 0);
            }
        }
    }
}
