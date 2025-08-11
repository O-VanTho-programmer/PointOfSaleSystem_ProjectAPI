using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("add")]
        public async Task<IActionResult> AddPayment(PaymentResponseDTO paymentRes)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.Payments.AnyAsync(p => p.PaymentId == paymentRes.PaymentId);

            if (exists)
                return BadRequest($"PaymentId {paymentRes.PaymentId} already exists");

            var payment = new Payments();
            payment.PaymentId = paymentRes.PaymentId;
            payment.OrderId = paymentRes.OrderId;
            payment.Amount = paymentRes.Amount;
            payment.PaymentMethod = paymentRes.PaymentMethod;
            payment.CreatedDate = DateTime.Now;
            payment.Status = "unpaid";

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment added successfully", payment });
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditPayment(int id, [FromBody] Payments updatedPayment)
        {
            if (id != updatedPayment.PaymentId)
                return BadRequest("ID mismatch");

            var existing = await _context.Payments.FindAsync(id);
            if (existing == null)
                return NotFound("Payment not found");

            existing.OrderId = updatedPayment.OrderId;
            existing.Amount = updatedPayment.Amount;
            existing.PaymentMethod = updatedPayment.PaymentMethod;
            existing.CreatedDate = updatedPayment.CreatedDate;
            existing.Status = updatedPayment.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Payment updated successfully", existing });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound("Payment not found");

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment deleted successfully" });
        }

        [HttpPost("pay/{id}")]
        public async Task<IActionResult> ProcessPayment(int id)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(o => o.PaymentId == id);

            if (payment == null)
            {
                return NotFound("Payment not found.");
            }

            if (payment.Status.Equals("paid"))
            {
                return Ok("Payment has paid");
            }

            var orders = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Item).FirstOrDefaultAsync(o => o.OrderId == payment.OrderId);

            if (orders == null)
            {
                return NotFound("Order not found.");
            }

            decimal totalAmount = 0;
            int totalQuantity = 0;

            foreach (var item in orders.OrderItems)
            {
                totalAmount += item.PriceAtOrder * item.Quantity;
                totalQuantity += item.Quantity;
            }

            decimal discountAmount = 0;

            if (orders.DiscountId != null)
            {
                int? DisID = orders.DiscountId;
                var discounts = await _context.Discounts
                    .Where(o => o.DiscountId == DisID)
                    .ToListAsync();
                if (discounts.Any())
                {
                    foreach (var discount in discounts)
                    {
                        if (discount.type.Equals("fixed"))
                        {
                            discountAmount += discount.value;
                        }
                        else if (discount.type.Equals("percentage"))
                        {
                            discountAmount += totalAmount * (discount.value / 100m);
                        }
                    }

                    totalAmount -= discountAmount;
                }
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
            orders.Status = 3;
            payment.Status = "paid";
            _context.SaveChanges();
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
