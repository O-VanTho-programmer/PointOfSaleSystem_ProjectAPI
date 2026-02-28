using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IDiscountService
    {
        Task<IEnumerable<Discounts>> GetAllDiscountsAsync();
        Task<Discounts?> GetDiscountByIdAsync(int id);
        Task<(Discounts? Discount, string? ErrorMessage)> CreateDiscountAsync(Discounts discount);
        Task<(Discounts? Discount, string? ErrorMessage)> UpdateDiscountAsync(int id, Discounts updatedDiscount);
        Task<bool> DeleteDiscountAsync(int id);

        Task<(bool Applicable, string? DiscountType, decimal? DiscountValue, decimal? RequiredMinAmount, string Message)> IsDiscountValidAsync(int discountId, int orderId);
    }
}
