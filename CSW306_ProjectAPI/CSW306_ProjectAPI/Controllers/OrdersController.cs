using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public OrdersController(CSW306_ProjectAPIContext context) { 
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Orders>>> Get() {
            return await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Item).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Orders>> Get(int id) { 
            var order = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Item).FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null) {
                return NotFound("Order Id not found");
            }

            return Ok(order);
        }

        [HttpPost]
        public async Task<ActionResult<Orders>> AddOrder([FromBody] OrdersUploadDTO dto) {
            if (dto.Items == null || !dto.Items.Any())
            {
                return BadRequest("Order must contain at least one item!");
            }


            var itemIds = dto.Items.Select(i => i.ItemId).ToList();
            var itemsInDb = await _context.Items
                .Where(item => itemIds.Contains(item.ItemId))
                .ToDictionaryAsync(i => i.ItemId);  

            var missingIds = itemIds.Except(itemsInDb.Keys).ToList();
            if (missingIds.Any())
            {
                return BadRequest($"ItemId(s) not found: {string.Join(", ", missingIds)}");
            }

            var orderItems = dto.Items.Select(i => new OrderItems
            {
                ItemId = i.ItemId,
                Quantity = i.Quantity,
                PriceAtOrder = itemsInDb[i.ItemId].Price
            }).ToList();

            var order = new Orders
            {
                Status = dto.Status,
                CreatedDate = dto.CreatedDate,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
