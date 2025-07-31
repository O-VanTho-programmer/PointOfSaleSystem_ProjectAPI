using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.Models
{
    public class Payments
    {
        [Key]
        [Required]
        public int PaymentId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string PaymentMethod { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(20)]
        public string Status { get; set; }
    }
}
