using CSW306.Domain.Entities;

namespace CSW306.Application.DTO.Response
{
    public class OrderResponseDTO
    {
        public int OrderId { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public KitchenStatus KitchenStatus { get; set; }
        public int? DiscountId { get; set; }
        public int? UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? TableNumber { get; set; }
        public OrderType? OrderType { get; set; }
        public List<OrderItemResponseDTO> OrderItems { get; set; }
    }
}
