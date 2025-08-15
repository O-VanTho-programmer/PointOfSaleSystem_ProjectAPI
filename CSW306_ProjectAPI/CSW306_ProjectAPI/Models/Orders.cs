using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306_ProjectAPI.Models
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
        //0: pending, 1: cooking, 2: completed
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }
    }
}
