using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IUnitOfWork unitOfWork) { 
            _unitOfWork = unitOfWork;
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrderAsync(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);

            OrderResponseDTO? res = null;

            if (order != null)
            {
                res = new OrderResponseDTO
                {
                    OrderId = order.OrderId,
                    Status = order.Status,
                    DiscountId = order.DiscountId,
                    UsserId = order.UserId,
                    CreatedDate = order.CreatedDate,
                    OrderItems = order.OrderItems == null ? new List<OrderItemResponseDTO>() : order.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ItemId = oi.ItemId,
                        OrderId = oi.OrderId,
                        Quantity = oi.Quantity,
                        PriceAtOrder = oi.PriceAtOrder,
                        Item = oi.Item == null ? null : new ItemResponseDTO
                        {
                            ItemId = oi.Item.ItemId,
                            Name = oi.Item.Name,
                            QuantityInStock = oi.Item.QuantityInStock,
                            Price = oi.Item.Price,
                            CategoryId = oi.Item.CategoryId
                        }
                    }).ToList()
                };
            }

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(res);
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrdersAsync(int pageNumber, int pageSize)
        {
            var orders = await _unitOfWork.Orders.GetAllAsync();

            var res = orders.Select(o => new OrderResponseDTO
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
            });

            return new Pagination().HandleGetAllRespond(pageNumber, pageSize,res, );
        }

        public Task<TemplateApi<OrderResponseDTO>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date)
        {
            throw new NotImplementedException();
        }
    }
}
