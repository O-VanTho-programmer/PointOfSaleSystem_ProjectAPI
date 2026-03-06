using System.ComponentModel.DataAnnotations;

namespace CSW306.Application.DTO.Upload
{
    public class RegisterCustomerDTO
    {
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(12)]
        public string Phone { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 4)]
        public string Password { get; set; }
    }
}
