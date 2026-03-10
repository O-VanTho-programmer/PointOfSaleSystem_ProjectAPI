using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class OrdersUploadDTO
    {
        [Required]
        public int Status { get; set; }

        public int? DiscountId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public List<OrderItemUploadDTO> OrderItems { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public string? TableNumber { get; set; }

        //0: dine in, 1: take away, 2: delivery
        public int? OrderType { get; set; }
    }
}
