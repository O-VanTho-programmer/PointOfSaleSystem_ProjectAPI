using Azure.Core;
using CSW306_ProjectAPI.DTO.Upload;
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
        public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> Get()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Select(o => new OrderResponseDTO
                {
                    OrderId = o.OrderId,
                    DiscountId = o.DiscountId,
                    UsserId = o.UserId,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ItemId = oi.ItemId,
                        OrderId = oi.OrderId,
                        Quantity = oi.Quantity,
                        PriceAtOrder = oi.PriceAtOrder,
                        Item = new ItemResponseDTO
                        {
                            ItemId = oi.Item.ItemId,
                            Name = oi.Item.Name,
                            QuantityInStock = oi.Item.QuantityInStock,
                            Price = oi.Item.Price,
                            CategoryId = oi.Item.CategoryId
                        }
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponseDTO>> Get(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Where(o => o.OrderId == id)
                .Select(o => new OrderResponseDTO
                {
                    OrderId = o.OrderId,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate,
                    DiscountId = o.DiscountId,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ItemId = oi.ItemId,
                        OrderId = oi.OrderId,
                        Quantity = oi.Quantity,
                        PriceAtOrder = oi.PriceAtOrder,
                        Item = new ItemResponseDTO
                        {
                            ItemId = oi.Item.ItemId,
                            Name = oi.Item.Name,
                            QuantityInStock = oi.Item.QuantityInStock,
                            Price = oi.Item.Price,
                            CategoryId = oi.Item.CategoryId
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
                return NotFound("Order Id not found");

            return Ok(order);
        }

        // Filter {this year} as default
        [HttpGet("filter_by_date_range")]
        public async Task<ActionResult<OrderResponseDTO>> Get(DateTime? start_date, DateTime? end_date)
        {
            start_date ??= new DateTime(DateTime.Now.Year, 1, 1);
            end_date ??= new DateTime(DateTime.Now.Year, 12, 31);
                
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .Where(o => o.CreatedDate >= start_date && o.CreatedDate <= end_date)
                .Select(o => new OrderResponseDTO
                {
                    OrderId = o.OrderId,
                    Status = o.Status,
                    CreatedDate = o.CreatedDate,
                    DiscountId = o.DiscountId,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ItemId = oi.ItemId,
                        OrderId = oi.OrderId,
                        Quantity = oi.Quantity,
                        PriceAtOrder = oi.PriceAtOrder,
                        Item = new ItemResponseDTO
                        {
                            ItemId = oi.Item.ItemId,
                            Name = oi.Item.Name,
                            QuantityInStock = oi.Item.QuantityInStock,
                            Price = oi.Item.Price,
                            CategoryId = oi.Item.CategoryId
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
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
                DiscountId = dto.DiscountId,
                UserId = dto.UserId,
                CreatedDate = dto.CreatedDate,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<Orders>> UpdateStatusOrder(int id, [FromBody] UpdateStatusOrderDTO request)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound(new { message = "Order not found" });
            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
