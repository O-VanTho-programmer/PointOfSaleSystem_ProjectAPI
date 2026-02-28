using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : ControllerBase
    {
        private readonly IDiscountService _discountService;

        public DiscountsController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Discounts>>> GetDiscounts()
        {
            var discounts = await _discountService.GetAllDiscountsAsync();
            return Ok(discounts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Discounts>> GetDiscount(int id)
        {
            var discount = await _discountService.GetDiscountByIdAsync(id);

            if (discount == null)
            {
                return NotFound("Order Id not found");
            }

            return Ok(discount);
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddDiscount([FromBody] Discounts discount)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (createdDiscount, errorMessage) = await _discountService.CreateDiscountAsync(discount);

            if (errorMessage != null)
                return BadRequest(errorMessage);

            return Ok(new { message = "Discount added successfully", discount = createdDiscount });
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var success = await _discountService.DeleteDiscountAsync(id);
            if (!success)
                return NotFound("Discount not found");

            return Ok(new { message = "Discount deleted successfully" });
        }

        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> EditDiscount(int id, [FromBody] Discounts updatedDiscount)
        {
            var (existing, errorMessage) = await _discountService.UpdateDiscountAsync(id, updatedDiscount);

            if (errorMessage != null)
            {
                if (errorMessage == "Discount not found") return NotFound(errorMessage);
                return BadRequest(errorMessage);
            }

            return Ok(new { message = "Discount updated successfully", existing });
        }

        [HttpPost("apply/{id}")]
        public async Task<IActionResult> isValid(int id, int OrderId)
        {
            var result = await _discountService.IsDiscountValidAsync(id, OrderId);

            if (!result.Applicable)
            {
                if (result.Message == "Discount code not found." || result.Message == "Order not found.")
                {
                    return NotFound(result.Message);
                }

                return Ok(new
                {
                    Applicable = false,
                    RequiredMinAmount = result.RequiredMinAmount,
                    Message = result.Message
                });
            }

            return Ok(new
            {
                Applicable = true,
                DiscountType = result.DiscountType,
                DiscountValue = result.DiscountValue,
                Message = result.Message
            });
        }
    }
}
