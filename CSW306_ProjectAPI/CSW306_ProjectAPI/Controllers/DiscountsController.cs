using CSW306_ProjectAPI.DTO.Upload;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("add")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> AddDiscount([FromBody] Discounts discount)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.Discounts.AnyAsync(p => p.DiscountId == discount.DiscountId);

            if (exists)
                return BadRequest($"DiscountId {discount.DiscountId} already exists");

            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Discount added successfully", discount });
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
                return NotFound("Discount not found");

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Discount deleted successfully" });
        }

        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> EditDiscount(int id, [FromBody] Discounts updatedDiscount)
        {
            if (id != updatedDiscount.DiscountId)
                return BadRequest("ID mismatch");

            var existing = await _context.Discounts.FindAsync(id);
            if (existing == null)
                return NotFound("Discount not found");

            // Update properties
            existing.DiscountCode = updatedDiscount.DiscountCode;
            existing.value = updatedDiscount.value;
            existing.type = updatedDiscount.type;
            existing.minOrderAmount = updatedDiscount.minOrderAmount;
            existing.startDate = updatedDiscount.startDate;
            existing.endDate = updatedDiscount.endDate;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Discount updated successfully", existing });
        }

        [HttpPost("apply/{id}")]

        public async Task<IActionResult> isValid(int id, int OrderId)
        {
            var discount = await _context.Discounts.FirstOrDefaultAsync(o => o.DiscountId == id);

            if (discount == null)
            {
                return NotFound("Discount code not found.");
            }

            var orders = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Item).FirstOrDefaultAsync(o => o.OrderId == OrderId);

            if (orders == null)
            {
                return NotFound("Order not found.");
            }

            var sumAmount = 0;

            foreach (var orderItem in orders.OrderItems)
            {
                sumAmount += orderItem.Quantity;
            }

            if (sumAmount >= discount.minOrderAmount)
            {
                orders.DiscountId = id;
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
