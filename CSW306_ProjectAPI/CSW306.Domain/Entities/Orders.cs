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
        public int UserId { get; set; }
        [Required]
        public OrderStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public KitchenStatus KitchenStatus { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        public int? TableNumber { get; set; }
        //0: dine in, 1: take away, 2: delivery
        public OrderType? OrderType { get; set; }

        public ICollection<OrderItems> OrderItems { get; set; }
    }
}

public enum OrderStatus
{ 
    Pending = -2,
    Cancelled = -1,
    Active = 0,
    Completed = 1
}

public enum PaymentStatus
{
    Voided = -2,
    Refunded = -1,
    Unpaid = 0,
    Paid = 1
}

public enum KitchenStatus
{
    Idle = -2,
    Cancelled = -1,
    Pending = 0,
    Cooking = 1, 
    Ready = 2,
    Served = 3
}

public enum OrderType
{
    DineIn = 0,
    TakeAway = 1
}