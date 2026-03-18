using CSW306.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class ItemsUploadDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsSoldOut { get; set; }
        [Required]
        public decimal Price { get; set; }
        // Nullable stream for optional image
        public Stream? ImageStream { get; set; }
        public string? ImageName { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
