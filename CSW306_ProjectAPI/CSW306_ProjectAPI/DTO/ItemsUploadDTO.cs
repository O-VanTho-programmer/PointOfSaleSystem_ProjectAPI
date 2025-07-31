using CSW306_ProjectAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO
{
    public class ItemsUploadDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int QuantityInStock { get; set; }
        [Required]
        public decimal Price { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
