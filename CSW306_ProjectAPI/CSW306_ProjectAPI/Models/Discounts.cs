using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.Models
{
    public class Discounts
    {
        [Key]
        [Required]
        public int DiscountId { get; set; }

        [Required]
        [StringLength(10)]
        public string DiscountCode { get; set; }

        [Required]
        public int value { get; set; }

        [Required]
        [StringLength(20)]
        public string type { get; set; }

        [Required]
        public decimal minOrderAmount { get; set; }

        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }

    }
}
