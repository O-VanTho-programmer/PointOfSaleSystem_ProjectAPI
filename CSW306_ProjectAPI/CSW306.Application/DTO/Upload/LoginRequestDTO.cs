using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class LoginRequestDTO
    {
        [Required]
        public string Phone { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
