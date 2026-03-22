using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IActivityLogService _activityLogService;
        private const string OrdersCacheSetKey = "orders:cachedKeys";

        public OrderService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService, IActivityLogService activityLogService)
        {
            _unitOfWork = unitOfWork;
            _redisCacheService = redisCacheService;
            _activityLogService = activityLogService;
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrderAsync(int id)
        {
            var pagination = new Pagination();
            try
            {
                var cacheKey = $"order:{id}";

                var cached = await _redisCacheService.GetAsync<OrderResponseDTO>(cacheKey);
                if (cached != null)
                {
                    return pagination.HandleGetByIdRespond(cached);
                }

                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);

                if (order == null)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                var res = new OrderResponseDTO
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
                        ItemName = oi.Item?.Name,
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

                await _redisCacheService.SetAsync(cacheKey, res, TimeSpan.FromMinutes(5));
                await _redisCacheService.SetAddAsync(OrdersCacheSetKey, cacheKey);

                return pagination.HandleGetByIdRespond(res);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while fetching the order.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrdersAsync(int pageNumber, int pageSize, DateTime? startDate, DateTime? endDate, int? status)
        {
            try
            {
                if (startDate.HasValue && startDate.Value.Kind == DateTimeKind.Unspecified)
                {
                    startDate = DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc);
                }
                if (endDate.HasValue && endDate.Value.Kind == DateTimeKind.Unspecified)
                {
                    endDate = DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc);
                }

                var startKey = startDate.HasValue ? startDate.Value.ToString("o") : "null";
                var endKey = endDate.HasValue ? endDate.Value.ToString("o") : "null";
                var statusKey = status.HasValue ? status.Value.ToString() : "null";
                var cacheKey = $"orders:page:{pageNumber}:size:{pageSize}:start:{startKey}:end:{endKey}:status:{statusKey}";

                var cached = await _redisCacheService.GetAsync<TemplateApi<OrderResponseDTO>>(cacheKey);
                if (cached != null)
                {
                    return cached;
                }

                var orders = await _unitOfWork.Orders.GetAllOrdersWithDetailsAsync(pageNumber, pageSize, startDate, endDate, status);

                var countRecord = await _unitOfWork.Orders.GetTotalOrdersCountAsync(startDate, endDate, status);

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
                        ItemName= oi.Item?.Name,
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

                var response = new Pagination().HandlePagedRespond(pageNumber, pageSize, res, countRecord);

                await _redisCacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(2));
                await _redisCacheService.SetAddAsync(OrdersCacheSetKey, cacheKey);

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while fetching orders.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date)
        {
            try
            {
                if (start_date.HasValue && start_date.Value.Kind == DateTimeKind.Unspecified)
                {
                    start_date = DateTime.SpecifyKind(start_date.Value, DateTimeKind.Utc);
                }
                if (end_date.HasValue && end_date.Value.Kind == DateTimeKind.Unspecified)
                {
                    end_date = DateTime.SpecifyKind(end_date.Value, DateTimeKind.Utc);
                }

                var startKey = start_date.HasValue ? start_date.Value.ToString("o") : "null";
                var endKey = end_date.HasValue ? end_date.Value.ToString("o") : "null";
                var cacheKey = $"orders:range:start:{startKey}:end:{endKey}";

                var cached = await _redisCacheService.GetAsync<TemplateApi<OrderResponseDTO>>(cacheKey);
                if (cached != null)
                {
                    return cached;
                }

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
                        ItemName = oi.Item?.Name,
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

                var response = new Pagination().HandleGetAllRespond(1, countRecord, res, countRecord);

                await _redisCacheService.SetAsync(cacheKey, response, TimeSpan.FromMinutes(2));
                await _redisCacheService.SetAddAsync(OrdersCacheSetKey, cacheKey);

                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while fetching orders by date range.", false, 0, 0, 0, 0);
            }
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
                
                var missingIds = itemIds.Except(existingItems.Keys).ToList();
                if (missingIds.Any())
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, $"The following items do not exist: {string.Join(", ", missingIds)}", false, 0, 0, 0, 0);
                }

                var soldOutItems = existingItems.Values.Where(i => i.IsSoldOut == true).Select(i => i.Name).ToList();
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
                    CreatedDate = DateTime.UtcNow,
                    TableNumber = dto.TableNumber,
                    OrderType = dto.OrderType,
                    OrderItems = orderItems
                };

                await _unitOfWork.Orders.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();

                // Invalidate cached order keys
                try
                {
                    var keys = await _redisCacheService.SetMembersAsync(OrdersCacheSetKey);
                    foreach (var k in keys)
                    {
                        await _redisCacheService.RemoveAsync(k);
                        await _redisCacheService.SetRemoveAsync(OrdersCacheSetKey, k);
                    }

                    // Remove per-item cache for the created order id
                    await _redisCacheService.RemoveAsync($"order:{order.OrderId}");
                }
                catch { /* ignore redis errors */ }

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

                var createDetails = $"User {order.UserId} created order {order.OrderId} with {order.OrderItems.Count} items.";
                await _activityLogService.LogActivity(new ActivityLogUploadDTO
                {
                    Action = "CreateOrder",
                    EntityName = "Order",
                    EntityId = order.OrderId,
                    UserId = order.UserId,
                    Details = createDetails
                });

                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while creating the order on the server.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> UpdateOrderStatusAsync(int id, UpdateStatusOrderDTO request)
        {
            var pagination = new Pagination();
            try
            {
                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);
                if (order == null)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found", false, 0, 0, 0, 0);
                }

                var oldStatus = order.Status;
                order.Status = request.Status;
                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.SaveChangesAsync();

                // Invalidate cached order keys
                try
                {
                    var keys = await _redisCacheService.SetMembersAsync(OrdersCacheSetKey);
                    foreach (var k in keys)
                    {
                        await _redisCacheService.RemoveAsync(k);
                        await _redisCacheService.SetRemoveAsync(OrdersCacheSetKey, k);
                    }

                    await _redisCacheService.RemoveAsync($"order:{order.OrderId}");
                }
                catch { }

                // Log status change including user performing the action
                var updateDetails = $"User {order.UserId} changed order {order.OrderId} status from {oldStatus} to {order.Status}.";
                await _activityLogService.LogActivity(new ActivityLogUploadDTO
                {
                    Action = "UpdateOrderStatus",
                    EntityName = "Order",
                    EntityId = order.OrderId,
                    UserId = order.UserId,
                    Details = updateDetails
                });

                var resDto = new OrderResponseDTO
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

                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while updating the order status.", false, 0, 0, 0, 0);
            }
        }
    }
}
