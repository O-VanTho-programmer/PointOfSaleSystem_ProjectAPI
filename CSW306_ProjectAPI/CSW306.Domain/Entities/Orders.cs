using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306.Domain.Entities
{
    public class Orders
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int OrderId { get; set; }

        public int? DiscountId { get; set; }
        public int? UserId { get; set; }

        [Required]
        //0: pending, 1:completed, 2: paid, -1: cancelled
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        public string? TableNumber { get; set; }
        //0: dine in, 1: take away, 2: delivery
        public int? OrderType { get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }
    }
}
