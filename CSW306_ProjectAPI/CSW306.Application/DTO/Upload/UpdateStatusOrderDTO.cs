using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class UpdateStatusOrderDTO
    {
        [Required]
        public int Status { get; set; }
    }
}
