using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO.Upload
{
    public class UpdateStatusOrderDTO
    {
        [Required]
        public int Status { get; set; }
    }
}
