using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Presentation.Requests
{
    public class CreateItemRequest
    {
        [Required]
        public string Name {  get; set; }
        [Required]
        public bool IsSoldOut {get; set; }
        [Required]
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
