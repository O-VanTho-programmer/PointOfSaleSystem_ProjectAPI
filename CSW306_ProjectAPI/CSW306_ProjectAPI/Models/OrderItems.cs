using System.ComponentModel.DataAnnotations;

namespace CSW306_ProjectAPI.Models
{
    public class OrderItems
    {
        [Required]
        public int ItemId { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal PriceAtOrder { get; set; }

        public Items Item { get; set; }
        public Orders Order { get; set; }

    }
}
