using CSW306.Application.DTO;
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
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payments>>> GetPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payments>> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (payment == null)
            {
                return NotFound("Order Id not found");
            }

            return Ok(payment);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> AddPayment(PaymentResponseDTO paymentRes)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (payment, errorMessage) = await _paymentService.CreatePaymentAsync(paymentRes);

            if (errorMessage != null)
                return BadRequest(errorMessage);

            return Ok(new { message = "Payment added successfully", payment });
        }

        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> EditPayment(int id, [FromBody] Payments updatedPayment)
        {
            var (existing, errorMessage) = await _paymentService.UpdatePaymentAsync(id, updatedPayment);

            if (errorMessage != null)
            {
                if (errorMessage == "Payment not found") return NotFound(errorMessage);
                return BadRequest(errorMessage);
            }

            return Ok(new { message = "Payment updated successfully", existing });
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var success = await _paymentService.DeletePaymentAsync(id);
            if (!success)
                return NotFound("Payment not found");

            return Ok(new { message = "Payment deleted successfully" });
        }

        [HttpPost("pay/{id}")]
        public async Task<IActionResult> ProcessPayment(int id)
        {
            var result = await _paymentService.ProcessPaymentAsync(id);

            if (!result.Success)
            {
                if (result.Message == "Payment not found." || result.Message == "Order not found.")
                {
                    return NotFound(result.Message);
                }
                
                if (result.Message == "Payment has paid")
                {
                    return Ok(result.Message);
                }

                if (result.Message == "Not enough money.")
                {
                    return BadRequest(new
                    {
                        Message = result.Message,
                        TotalAmount = result.TotalAmountToPay,
                        PaidAmount = result.PaidAmount,
                        Shortage = result.Change
                    });
                }

                return BadRequest(result.Message);
            }

            return Ok(new
            {
                Message = result.Message,
                TotalQuantity = result.TotalQuantity,
                DiscountApplied = result.DiscountApplied,
                TotalAmountToPay = result.TotalAmountToPay,
                PaidAmount = result.PaidAmount,
                Change = result.Change
            });
        }
    }
}
