using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public PaymentsController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Payments>> GetPayments()
        {
            return _context.Payments.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payments>> GetPayment(int id)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(o => o.PaymentId == id);

            if (payment == null)
            {
                return NotFound("Order Id not found");
            }

            return Ok(payment);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> ProcessPayment([FromBody] Orders orders, int id)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(o => o.PaymentId == id);
            if (payment == null)
            {
                return NotFound("Payment not found.");
            }

            decimal totalAmount = 0;
            int totalQuantity = 0;

            foreach (var item in orders.OrderItems)
            {
                totalAmount += item.PriceAtOrder * item.Quantity;
                totalQuantity += item.Quantity;
            }

            var discounts = await _context.Discounts
                .Where(o => o.isActive == true)
                .ToListAsync();

            decimal discountAmount = 0;

            if (discounts.Any())
            {
                foreach (var discount in discounts)
                {
                    if (discount.type == "fixed")
                    {
                        discountAmount += discount.value;
                    }
                    else if (discount.type == "percent")
                    {
                        discountAmount += totalAmount * (discount.value / 100m);
                    }
                }

                totalAmount -= discountAmount;
            }

            if (payment.Amount < totalAmount)
            {
                return BadRequest(new
                {
                    Message = "Not enough money.",
                    TotalAmount = totalAmount,
                    PaidAmount = payment.Amount,
                    Shortage = totalAmount - payment.Amount
                });
            }

            decimal change = payment.Amount - totalAmount;

            return Ok(new
            {
                Message = "Payment successful.",
                TotalQuantity = totalQuantity,
                DiscountApplied = discountAmount,
                TotalAmountToPay = totalAmount,
                PaidAmount = payment.Amount,
                Change = change
            });
        }
    }
}
