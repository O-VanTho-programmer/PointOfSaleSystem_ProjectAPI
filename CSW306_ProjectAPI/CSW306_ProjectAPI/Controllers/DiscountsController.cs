using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;
        
        public DiscountsController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Discounts>> GetDiscounts()
        {
            return _context.Discounts.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Discounts>> GetDiscount(int id)
        {
            var discount = await _context.Discounts.FirstOrDefaultAsync(o => o.DiscountId == id);

            if (discount == null)
            {
                return NotFound("Order Id not found");
            }

            return Ok(discount);
        }

        [HttpPost("{id}")]
        
        public async Task<IActionResult> isValid([FromBody] OrdersUploadDTO dto, int id)
        {
            var discount = await _context.Discounts.FirstOrDefaultAsync(o => o.DiscountId == id);

            if (discount == null)
            {
                return NotFound("Discount code not found.");
            }

            var sumAmount = 0;

            foreach (var item in dto.Items)
            {
                sumAmount += item.Quantity;
            }

            if (sumAmount >= discount.minOrderAmount)
            {
                discount.isActive = true;
                _context.SaveChanges();
                return Ok(new
                {
                    Applicable = true,
                    DiscountType = discount.type,
                    DiscountValue = discount.value,
                    Message = "Discount is applicable."
                });
            }
            else
            {
                return Ok(new
                {
                    Applicable = false,
                    RequiredMinAmount = discount.minOrderAmount,
                    Message = "Order total is less than the minimum required to apply this discount."
                });
            }
        }
    }
}
