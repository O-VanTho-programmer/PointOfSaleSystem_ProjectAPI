using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);

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
                    TableNumber = order.TableNumber,
                    OrderItems = order.OrderItems?.Select(oi => new OrderItemResponseDTO
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
                    }).ToList() ?? new List<OrderItemResponseDTO>()
                };
            }

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(res);
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrdersAsync(int pageNumber, int pageSize)
        {
            var orders = await _unitOfWork.Orders.GetAllOrdersWithDetailsAsync(pageNumber, pageSize);
            var countRecord = await _unitOfWork.Orders.GetTotalOrdersCountAsync();

            var res = orders.Select(o => new OrderResponseDTO
            {
                OrderId = o.OrderId,
                DiscountId = o.DiscountId,
                UsserId = o.UserId,
                Status = o.Status,
                CreatedDate = o.CreatedDate,
                TableNumber = o.TableNumber,
                OrderItems = o.OrderItems?.Select(oi => new OrderItemResponseDTO
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
                }).ToList() ?? new List<OrderItemResponseDTO>()
            });

            return new Pagination().HandlePagedRespond(pageNumber, pageSize, res, countRecord);
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date)
        {
            var orders = await _unitOfWork.Orders.GetByDateRange(start_date, end_date);
            var countRecord = orders.Count();

            var res = orders.Select(o => new OrderResponseDTO
            {
                OrderId = o.OrderId,
                DiscountId = o.DiscountId,
                UsserId = o.UserId,
                Status = o.Status,
                CreatedDate = o.CreatedDate,
                TableNumber = o.TableNumber,
                OrderItems = o.OrderItems?.Select(oi => new OrderItemResponseDTO
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
                }).ToList() ?? new List<OrderItemResponseDTO>()
            });

            return new Pagination().HandleGetAllRespond(1, countRecord, res, countRecord);
        }

        public async Task<Orders?> CreateOrderAsync(OrdersUploadDTO dto)
        {
            if (dto.Items == null || !dto.Items.Any())
            {
                return null;
            }

            var itemIds = dto.Items.Select(i => i.ItemId).ToList();
            var itemsList = await _unitOfWork.Items.GetAllAsync();
            var itemsInDb = itemsList.Where(item => itemIds.Contains(item.ItemId)).ToDictionary(i => i.ItemId);

            var missingIds = itemIds.Except(itemsInDb.Keys).ToList();
            if (missingIds.Any())
            {
                return null;
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
                TableNumber = dto.TableNumber,
                OrderItems = orderItems
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();
            return order;
        }

        public async Task<Orders?> UpdateOrderStatusAsync(int id, UpdateStatusOrderDTO request)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return null;

            order.Status = request.Status;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            return order;
        }
    }
}
