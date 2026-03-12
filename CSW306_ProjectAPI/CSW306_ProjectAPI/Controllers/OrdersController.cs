using Azure.Core;
using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService) 
        { 
            _orderService = orderService;
        }

        [HttpGet]
        [Authorize(Roles = "Manager,Employee,Chef,Cashier")]
        public async Task<IActionResult> Get([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 100)
        {
            var orders = await _orderService.GetOrdersAsync(pageNumber, pageSize);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _orderService.GetOrderAsync(id);

            if (!order.Success)
                return NotFound(order.Message);

            return Ok(order);
        }

        [HttpGet("filter_by_date_range")]
        [Authorize(Roles = "Manager,Cashier")]
        public async Task<IActionResult> Get([FromQuery] DateTime? start_date, [FromQuery] DateTime? end_date)
        {
            var order = await _orderService.GetOrdersByDateRange(start_date, end_date);

            if (!order.Success)
            {
                return NotFound(order.Message);
            }

            return Ok(order);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TemplateApi<OrderResponseDTO>>> AddOrder([FromBody] OrdersUploadDTO dto) 
        {
            var order = await _orderService.CreateOrderAsync(dto);

            if (!order.Success)
            {
                return BadRequest(order.Message);
            }

            return Ok(order);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Manager,Employee,Chef,Cashier")]
        public async Task<ActionResult<TemplateApi<OrderResponseDTO>>> UpdateStatusOrder(int id, [FromBody] UpdateStatusOrderDTO request)
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, request);

            if (!order.Success)
                return NotFound(order.Message);

            return Ok(order);
        }
    }
}
