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

        public async Task<TemplateApi<OrderResponseDTO>> CreateOrderAsync(OrdersUploadDTO dto)
        {
            var pagination = new Pagination();
            try
            {
                if (dto == null)
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order data is missing.", false, 0, 0, 0, 0);

                if (dto.OrderItems == null || !dto.OrderItems.Any())
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order must contain at least one item.", false, 0, 0, 0, 0);
                }

                // Basic validation: quantities must be positive
                if (dto.OrderItems.Any(i => i.Quantity <= 0))
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "All order items must have a quantity greater than zero.", false, 0, 0, 0, 0);
                }

                var itemIds = dto.OrderItems.Select(i => i.ItemId).ToList();
                var itemsList = await _unitOfWork.Items.GetAllAsync();
                
                var existingItems = itemsList.Where(i => itemIds.Contains(i.ItemId)).ToDictionary(i => i.ItemId);
                
                // Check for missing items
                var missingIds = itemIds.Except(existingItems.Keys).ToList();
                if (missingIds.Any())
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, $"The following items do not exist: {string.Join(", ", missingIds)}", false, 0, 0, 0, 0);
                }

                // Check for sold out items
                var soldOutItems = existingItems.Values.Where(i => i.IsSoldOut == 1).Select(i => i.Name).ToList();
                if (soldOutItems.Any())
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, $"The following items are currently sold out: {string.Join(", ", soldOutItems)}", false, 0, 0, 0, 0);
                }

                var orderItems = dto.OrderItems.Select(i => new OrderItems
                {
                    ItemId = i.ItemId,
                    Quantity = i.Quantity,
                    PriceAtOrder = existingItems[i.ItemId].Price
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

                _auditLogService.EnqueueLog("CreateOrder", "Orders", order.OrderId, dto.UserId, $"Status: {dto.Status}, Items: {dto.OrderItems.Count}");

                var resDto = new OrderResponseDTO
                {
                    OrderId = order.OrderId,
                    Status = order.Status,
                    DiscountId = order.DiscountId,
                    UsserId = order.UserId,
                    CreatedDate = order.CreatedDate,
                    TableNumber = order.TableNumber,
                    OrderType = order.OrderType,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDTO
                    {
                        ItemId = oi.ItemId,
                        OrderId = oi.OrderId,
                        Quantity = oi.Quantity,
                        PriceAtOrder = oi.PriceAtOrder
                    }).ToList()
                };

                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                var userId = dto?.UserId;
                _auditLogService.EnqueueLog("CreateOrderError", "Orders", null, userId, $"Exception: {ex.Message}");
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while creating the order on the server.", false, 0, 0, 0, 0);
            }
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
