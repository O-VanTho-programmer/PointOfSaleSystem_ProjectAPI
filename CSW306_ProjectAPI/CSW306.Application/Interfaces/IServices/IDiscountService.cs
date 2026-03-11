using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IDiscountService
    {
        Task<TemplateApi<Discounts>> GetAllDiscountsAsync();
        Task<TemplateApi<Discounts>> GetDiscountByIdAsync(int id);
        Task<TemplateApi<Discounts>> CreateDiscountAsync(Discounts discount);
        Task<TemplateApi<Discounts>> UpdateDiscountAsync(int id, Discounts updatedDiscount);
        Task<TemplateApi<Discounts>> DeleteDiscountAsync(int id);

        Task<TemplateApi<object>> IsDiscountValidAsync(int discountId, int orderId);
    }
}
