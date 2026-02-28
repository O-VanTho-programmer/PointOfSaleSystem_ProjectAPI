using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DiscountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Discounts>> GetAllDiscountsAsync()
        {
            return await _unitOfWork.Discounts.GetAllAsync();
        }

        public async Task<Discounts?> GetDiscountByIdAsync(int id)
        {
            return await _unitOfWork.Discounts.GetByIdAsync(id);
        }

        public async Task<(Discounts? Discount, string? ErrorMessage)> CreateDiscountAsync(Discounts discount)
        {
            var existing = await _unitOfWork.Discounts.GetByIdAsync(discount.DiscountId);
            if (existing != null)
            {
                return (null, $"DiscountId {discount.DiscountId} already exists");
            }

            await _unitOfWork.Discounts.AddAsync(discount);
            await _unitOfWork.SaveChangesAsync();

            return (discount, null);
        }

        public async Task<(Discounts? Discount, string? ErrorMessage)> UpdateDiscountAsync(int id, Discounts updatedDiscount)
        {
            if (id != updatedDiscount.DiscountId)
            {
                return (null, "ID mismatch");
            }

            var existing = await _unitOfWork.Discounts.GetByIdAsync(id);
            if (existing == null)
            {
                return (null, "Discount not found");
            }

            existing.DiscountCode = updatedDiscount.DiscountCode;
            existing.value = updatedDiscount.value;
            existing.type = updatedDiscount.type;
            existing.minOrderAmount = updatedDiscount.minOrderAmount;
            existing.startDate = updatedDiscount.startDate;
            existing.endDate = updatedDiscount.endDate;

            await _unitOfWork.Discounts.UpdateAsync(existing);
            await _unitOfWork.SaveChangesAsync();

            return (existing, null);
        }

        public async Task<bool> DeleteDiscountAsync(int id)
        {
            var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
            if (discount == null) return false;

            await _unitOfWork.Discounts.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Applicable, string? DiscountType, decimal? DiscountValue, decimal? RequiredMinAmount, string Message)> IsDiscountValidAsync(int discountId, int orderId)
        {
            var discount = await _unitOfWork.Discounts.GetByIdAsync(discountId);
            if (discount == null)
            {
                return (false, null, null, null, "Discount code not found.");
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(orderId);
            if (order == null)
            {
                return (false, null, null, null, "Order not found.");
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

                return (true, discount.type, discount.value, null, "Discount is applicable.");
            }
            
            return (false, null, null, discount.minOrderAmount, "Order total is less than the minimum required to apply this discount.");
        }
    }
}
