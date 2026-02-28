using CSW306.Application.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IOrderService
    {
        Task<TemplateApi<OrderResponseDTO>> GetOrdersAsync(int pageNumber, int pageSize);
        Task<TemplateApi<OrderResponseDTO>> GetOrderAsync(int id);
        Task<TemplateApi<OrderResponseDTO>> GetOrdersByDateRange(DateTime? start_date, DateTime? end_date);
    }
}
