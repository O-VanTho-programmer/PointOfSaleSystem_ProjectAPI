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

        [Required]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }
    }
}
