using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.DTO.Upload
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
        public string Password { get; set; }
    }
}
