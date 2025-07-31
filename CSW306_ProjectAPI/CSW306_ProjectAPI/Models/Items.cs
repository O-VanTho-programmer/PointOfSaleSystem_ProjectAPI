using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CSW306_ProjectAPI.Models
{
    public class Items
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ItemId { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public int QuantityInStock { get; set; }
        [Required]
        public decimal Price { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public Categories Category {  get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }

    }
}
