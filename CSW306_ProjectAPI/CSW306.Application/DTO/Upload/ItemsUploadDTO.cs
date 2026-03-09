using CSW306.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class ItemsUploadDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int IsSoldOut { get; set; }
        [Required]
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
