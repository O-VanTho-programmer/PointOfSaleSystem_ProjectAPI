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
        private readonly IRedisCacheService _redisCacheService;
        private readonly IAuditLogService _auditLogService;

        public OrderService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService, IAuditLogService auditLogService) { 
            _unitOfWork = unitOfWork;
            _redisCacheService = redisCacheService;
            _auditLogService = auditLogService;
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
                    OrderType = order.OrderType,
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
                            IsSoldOut = oi.Item.IsSoldOut,
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
                OrderType = o.OrderType,
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
                        IsSoldOut = oi.Item.IsSoldOut,
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
                OrderType = o.OrderType,
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
                        IsSoldOut = oi.Item.IsSoldOut,
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
            var selectedItems = itemsList
                .Where(item => itemIds.Contains(item.ItemId))
                .Where(item => item.IsSoldOut == 0)
                .ToDictionary(i => i.ItemId);

            var missingIds = itemIds.Except(selectedItems.Keys).ToList();
            if (missingIds.Any())
            {
                return null;
            }


            var orderItems = dto.Items.Select(i => new OrderItems
            {
                ItemId = i.ItemId,
                Quantity = i.Quantity,
                PriceAtOrder = selectedItems[i.ItemId].Price
            }).ToList();

            var order = new Orders
            {
                Status = dto.Status,
                DiscountId = dto.DiscountId,
                UserId = dto.UserId,
                CreatedDate = dto.CreatedDate,
                TableNumber = dto.TableNumber,
                OrderType = dto.OrderType,
                OrderItems = orderItems
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            _auditLogService.EnqueueLog("CreateOrder", "Orders", order.OrderId, dto.UserId, $"Status: {dto.Status}, Items: {dto.Items.Count}");

            return order;
        }

        public async Task<Orders?> UpdateOrderStatusAsync(int id, UpdateStatusOrderDTO request)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return null;

            order.Status = request.Status;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            _auditLogService.EnqueueLog("UpdateOrderStatus", "Orders", order.OrderId, null, $"New status: {request.Status}");

            return order;
        }
    }
}
