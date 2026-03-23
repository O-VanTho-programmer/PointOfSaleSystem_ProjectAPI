using CSW306.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class UpdateKitchenStatusDTO
    {
        [Required]
        public KitchenStatus KitchenStatus { get; set; }
    }
}
