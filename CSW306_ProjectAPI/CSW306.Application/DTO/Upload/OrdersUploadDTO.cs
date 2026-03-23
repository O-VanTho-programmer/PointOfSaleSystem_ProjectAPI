using CSW306.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class OrdersUploadDTO
    {
        [Required]
        public OrderStatus Status { get; set; }

        public int? DiscountId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public List<OrderItemUploadDTO> OrderItems { get; set; }

        public int? TableNumber { get; set; }

        [Required]
        public OrderType OrderType { get; set; }
    }
}
