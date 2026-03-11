using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
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
        public async Task<ActionResult<TemplateApi<Discounts>>> GetDiscounts()
        {
            var discounts = await _discountService.GetAllDiscountsAsync();
            return Ok(discounts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Discounts>>> GetDiscount(int id)
        {
            var discount = await _discountService.GetDiscountByIdAsync(id);

            if (!discount.Success)
            {
                if (discount.Message == "Order Id not found") return NotFound(discount);
                return BadRequest(discount);
            }

            return Ok(discount);
        }

        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddDiscount([FromBody] Discounts discount)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdDiscount = await _discountService.CreateDiscountAsync(discount);

            if (!createdDiscount.Success)
            {
                if (createdDiscount.Message.Contains("already exists")) return Conflict(createdDiscount);
                return BadRequest(createdDiscount);
            }

            return Ok(createdDiscount);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var result = await _discountService.DeleteDiscountAsync(id);
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> EditDiscount(int id, [FromBody] Discounts updatedDiscount)
        {
            var existing = await _discountService.UpdateDiscountAsync(id, updatedDiscount);

            if (!existing.Success)
            {
                if (existing.Message == "Discount not found") return NotFound(existing);
                return BadRequest(existing);
            }

            return Ok(existing);
        }

        [HttpPost("apply/{id}")]
        public async Task<IActionResult> isValid(int id, int OrderId)
        {
            var result = await _discountService.IsDiscountValidAsync(id, OrderId);

            if (!result.Success && result.Message != "Order total is less than the minimum required to apply this discount.")
            {
                if (result.Message == "Discount code not found." || result.Message == "Order not found.")
                {
                    return NotFound(result);
                }

                return BadRequest(result);
            }

            return Ok(result); // Applies for `.Success == true` or `.Success == false && Message == Order total is less...` which carries payload.
        }
    }
}
