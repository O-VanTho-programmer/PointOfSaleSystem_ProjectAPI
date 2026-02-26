using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class OrderItemUploadDTO
    {
        [Required]
        public int ItemId { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
