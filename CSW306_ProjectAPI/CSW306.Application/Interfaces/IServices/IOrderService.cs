using CSW306.Application.DTO.Upload;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IOrderService
    {
        Task<TemplateApi<OrderResponseDTO>> GetOrdersAsync(int pageNumber, int pageSize, DateTime? start_date, DateTime? end_date, int? status);
        Task<TemplateApi<OrderResponseDTO>> GetOrderAsync(int id);
        Task<TemplateApi<OrderResponseDTO>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date);
        Task<TemplateApi<OrderResponseDTO>> CreateOrderAsync(OrdersUploadDTO dto);
        Task<TemplateApi<OrderResponseDTO>> UpdateOrderStatusAsync(int id, UpdateStatusOrderDTO request);
    }
}
