using CSW306.Application.DTO.Upload;
using CSW306.Application.DTO.Response;
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
        private readonly ICurrentUserProvider _currentUserProvider;
        private const string OrdersCacheSetKey = "orders:cachedKeys";

        public OrderService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService, ICurrentUserProvider currentUserProvider)
        {
            _unitOfWork = unitOfWork;
            _redisCacheService = redisCacheService;
            _currentUserProvider = currentUserProvider;
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

                var res = MapOrderToResponseDTO(order);

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

                var res = orders.Select(o => MapOrderToResponseDTO(o));

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

                var res = orders.Select(o => MapOrderToResponseDTO(o));

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

                if (dto.TableNumber != null)
                {
                    int selectedTableNumber = dto.TableNumber.Value;
                    var table = await _unitOfWork.Tables.GetByIdAsync(selectedTableNumber);

                    if (table == null)
                    {
                        return new TemplateApi<OrderResponseDTO>(null, null, $"The table {selectedTableNumber} does not exist.", false, 0, 0, 0, 0);
                    }

                    if (table.Status.Equals("occupied", StringComparison.OrdinalIgnoreCase))
                    {
                        return new TemplateApi<OrderResponseDTO>(null, null, $"The table {selectedTableNumber} is already occupied", false, 0, 0, 0, 0);
                    }
                }

                var orderItems = dto.OrderItems.Select(i => new OrderItems
                {
                    ItemId = i.ItemId,
                    Quantity = i.Quantity,
                    PriceAtOrder = existingItems[i.ItemId].Price
                }).ToList();

                var order = new Orders
                {
                    Status = OrderStatus.Active,  
                    PaymentStatus = PaymentStatus.Unpaid,  
                    KitchenStatus = KitchenStatus.Pending, 
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
                    await _redisCacheService.RemoveAsync($"order:{order.OrderId}");
                }
                catch { /* ignore redis errors */ }

                var resDto = MapOrderToResponseDTO(order);

                // Activity log
                try
                {
                    var performerId = _currentUserProvider?.GetCurrentUserId();
                    Users? performer = null;
                    if (performerId.HasValue)
                    {
                        performer = await _unitOfWork.Users.GetByIdAsync(performerId.Value);
                    }

                    var performerDescriptor = performer != null
                        ? $"{performer.Role ?? "Staff"} {performer.Name}"
                        : (performerId.HasValue ? $"User #{performerId.Value}" : "System");

                    var itemWord = order.OrderItems.Count == 1 ? "item" : "items";
                    var orderTypeDesc = order.OrderType == OrderType.DineIn ? "Dine-In" : "Take-Away";

                    var createDetails = $"{performerDescriptor} created Order #{order.OrderId} ({orderTypeDesc}) with {order.OrderItems.Count} {itemWord}. Initial statuses - Order: Active, Payment: Unpaid, Kitchen: Pending.";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "CreateOrder",
                        EntityName = "Order",
                        EntityId = order.OrderId,
                        UserId = performerId ?? 0,
                        Details = createDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* ignore logging failures */ }

                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while creating the order.", false, 0, 0, 0, 0);
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
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                var oldStatus = order.Status;
                var oldPaymentStatus = order.PaymentStatus;
                var oldKitchenStatus = order.KitchenStatus;
                
                order.Status = request.Status;

                if (request.Status == OrderStatus.Cancelled)
                {
                    if (order.PaymentStatus == PaymentStatus.Paid)
                    {
                        order.PaymentStatus = PaymentStatus.Refunded;
                    }
                    else
                    {
                        order.PaymentStatus = PaymentStatus.Voided;
                    }

                    order.KitchenStatus = KitchenStatus.Cancelled;
                }

                await _unitOfWork.Orders.UpdateAsync(order);

                InvalidateOrderCache(order.OrderId);

                // Activity log
                try
                {
                    var performerId = _currentUserProvider?.GetCurrentUserId();
                    var performerName = _currentUserProvider?.GetCurrentUserName() ?? "System";
                    var performerRole = _currentUserProvider?.GetCurrentUserRole() ?? "Staff";
                   
                    var performerDescriptor = performerId.HasValue
                        ? $"{performerRole} {performerName}"
                        : "System";

                    var updateDetails = $"{performerDescriptor} updated Order #{order.OrderId} status: {oldStatus} => {order.Status}";

                    if (request.Status == OrderStatus.Cancelled)
                    {
                        updateDetails += $", payment status: {oldPaymentStatus} => {order.PaymentStatus}, kitchen status: {oldKitchenStatus} => {order.KitchenStatus}";
                    }

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "UpdateOrderStatus",
                        EntityName = "Order",
                        EntityId = order.OrderId,
                        UserId = performerId ?? 0,
                        Details = updateDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* ignore logging failures */ }

                var resDto = MapOrderToResponseDTO(order);
                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while updating the order status.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> UpdatePaymentStatusAsync(int id, UpdatePaymentStatusDTO request)
        {
            var pagination = new Pagination();
            try
            {
                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);
                if (order == null)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                var oldPaymentStatus = order.PaymentStatus;
                order.PaymentStatus = request.PaymentStatus;

                // Business rule: If TakeAway order just got paid, move kitchen status to Pending (ready for kitchen)
                if (request.PaymentStatus == PaymentStatus.Paid && order.OrderType == OrderType.TakeAway)
                {
                    order.KitchenStatus = KitchenStatus.Pending;
                }

                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.SaveChangesAsync();

                InvalidateOrderCache(order.OrderId);

                // Activity log
                try
                {
                    var performerId = _currentUserProvider?.GetCurrentUserId();
                    var performerName = _currentUserProvider?.GetCurrentUserName() ?? "System";
                    var performerRole = _currentUserProvider?.GetCurrentUserRole() ?? "Staff";

                    var performerDescriptor = performerId.HasValue
                        ? $"{performerRole} {performerName}"
                        : "System";

                    var kitchenUpdate = order.OrderType == OrderType.TakeAway && request.PaymentStatus == PaymentStatus.Paid 
                        ? $"; Kitchen status set to Pending for cooking."
                        : string.Empty;

                    var updateDetails = $"{performerDescriptor} updated Order #{order.OrderId} payment status: {oldPaymentStatus} => {order.PaymentStatus}{kitchenUpdate}";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "UpdatePaymentStatus",
                        EntityName = "Order",
                        EntityId = order.OrderId,
                        UserId = performerId ?? 0,
                        Details = updateDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* ignore logging failures */ }

                var resDto = MapOrderToResponseDTO(order);
                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while updating the payment status.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> UpdateKitchenStatusAsync(int id, UpdateKitchenStatusDTO request)
        {
            var pagination = new Pagination();
            try
            {
                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);
                if (order == null)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                var oldKitchenStatus = order.KitchenStatus;
                order.KitchenStatus = request.KitchenStatus;
                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.SaveChangesAsync();

                InvalidateOrderCache(order.OrderId);

                // Activity log
                try
                {
                    var performerId = _currentUserProvider?.GetCurrentUserId();
                    var performerName = _currentUserProvider?.GetCurrentUserName() ?? "System";
                    var performerRole = _currentUserProvider?.GetCurrentUserRole() ?? "Staff";

                    var performerDescriptor = performerId.HasValue
                        ? $"{performerRole} {performerName}"
                        : "System";

                    var updateDetails = $"{performerDescriptor} updated Order #{order.OrderId} kitchen status: {oldKitchenStatus} => {order.KitchenStatus}.";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "UpdateKitchenStatus",
                        EntityName = "Order",
                        EntityId = order.OrderId,
                        UserId = performerId ?? 0,
                        Details = updateDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* ignore logging failures */ }

                var resDto = MapOrderToResponseDTO(order);
                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while updating the kitchen status.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<OrderResponseDTO>> CompleteOrderAsync(int id)
        {
            var pagination = new Pagination();
            try
            {
                var order = await _unitOfWork.Orders.GetOrderByIdWithDetailsAsync(id);
                if (order == null)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, "Order not found.", false, 0, 0, 0, 0);
                }

                // Only complete if payment is done and kitchen is served/ready
                if (order.PaymentStatus != PaymentStatus.Paid)
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, $"Cannot complete order. Payment status is {order.PaymentStatus}. Must be Paid.", false, 0, 0, 0, 0);
                }

                var validKitchenStatuses = new[] { KitchenStatus.Served, KitchenStatus.Ready };
                if (!validKitchenStatuses.Contains(order.KitchenStatus))
                {
                    return new TemplateApi<OrderResponseDTO>(null, null, $"Cannot complete order. Kitchen status is {order.KitchenStatus}. Must be Served or Ready.", false, 0, 0, 0, 0);
                }

                var oldStatus = order.Status;
                order.Status = OrderStatus.Completed;
                await _unitOfWork.Orders.UpdateAsync(order);
                await _unitOfWork.SaveChangesAsync();

                InvalidateOrderCache(order.OrderId);

                // Activity log
                try
                {
                    var performerId = _currentUserProvider?.GetCurrentUserId();
                    Users? performer = null;
                    if (performerId.HasValue)
                    {
                        performer = await _unitOfWork.Users.GetByIdAsync(performerId.Value);
                    }

                    var performerDescriptor = performer != null
                        ? $"{performer.Role ?? "Staff"} {performer.Name}"
                        : (performerId.HasValue ? $"User #{performerId.Value}" : "System");

                    var completeDetails = $"{performerDescriptor} completed Order #{order.OrderId}. Final statuses - Order: {order.Status}, Payment: {order.PaymentStatus}, Kitchen: {order.KitchenStatus}.";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "CompleteOrder",
                        EntityName = "Order",
                        EntityId = order.OrderId,
                        UserId = performerId ?? 0,
                        Details = completeDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* ignore logging failures */ }

                var resDto = MapOrderToResponseDTO(order);
                return pagination.HandleGetByIdRespond(resDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<OrderResponseDTO>(null, null, "An unexpected error occurred while completing the order.", false, 0, 0, 0, 0);
            }
        }

        // Helper method to map Orders entity to OrderResponseDTO
        private OrderResponseDTO MapOrderToResponseDTO(Orders order)
        {
            return new OrderResponseDTO
            {
                OrderId = order.OrderId,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                KitchenStatus = order.KitchenStatus,
                DiscountId = order.DiscountId,
                UserId = order.UserId,
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
        }

        // Helper method to invalidate cache
        private async void InvalidateOrderCache(int orderId)
        {
            try
            {
                var keys = await _redisCacheService.SetMembersAsync(OrdersCacheSetKey);
                foreach (var k in keys)
                {
                    await _redisCacheService.RemoveAsync(k);
                    await _redisCacheService.SetRemoveAsync(OrdersCacheSetKey, k);
                }
                await _redisCacheService.RemoveAsync($"order:{orderId}");
            }
            catch { /* ignore redis errors */ }
        }
    }
}
