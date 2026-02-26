using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class LoginRequestDTO
    {
        [Required]
        public string Phone { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
