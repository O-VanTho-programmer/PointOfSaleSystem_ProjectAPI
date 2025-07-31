using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO
{
    public class OrderItemUploadDTO
    {
        [Required]
        public int ItemId { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
