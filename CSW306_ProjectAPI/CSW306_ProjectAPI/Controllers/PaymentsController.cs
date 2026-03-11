using CSW306.Application.DTO;
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
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<ActionResult<TemplateApi<Payments>>> GetPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Payments>>> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            if (!payment.Success)
            {
                if (payment.Message == "Payment not found") return NotFound(payment);
                return BadRequest(payment);
            }

            return Ok(payment);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> AddPayment(PaymentResponseDTO paymentRes)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var payment = await _paymentService.CreatePaymentAsync(paymentRes);

            if (!payment.Success)
            {
                if (payment.Message.Contains("already exists")) return Conflict(payment);
                return BadRequest(payment);
            }

            return Ok(payment);
        }

        [HttpPut("edit/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> EditPayment(int id, [FromBody] Payments updatedPayment)
        {
            var payment = await _paymentService.UpdatePaymentAsync(id, updatedPayment);

            if (!payment.Success)
            {
                if (payment.Message == "Payment not found") return NotFound(payment);
                return BadRequest(payment);
            }

            return Ok(payment);
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var result = await _paymentService.DeletePaymentAsync(id);
            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPost("pay/{id}")]
        public async Task<IActionResult> ProcessPayment(int id)
        {
            var result = await _paymentService.ProcessPaymentAsync(id);

            if (!result.Success)
            {
                if (result.Message == "Payment not found." || result.Message == "Order not found.")
                {
                    return NotFound(result);
                }
                
                if (result.Message == "Payment has paid")
                {
                    return Ok(result);
                }

                if (result.Message == "Not enough money.")
                {
                    return BadRequest(result);
                }

                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
