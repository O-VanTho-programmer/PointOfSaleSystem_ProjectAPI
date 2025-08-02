using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO
{
    public class LoginRequestDTO
    {
        [Required]
        public string Phone { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
