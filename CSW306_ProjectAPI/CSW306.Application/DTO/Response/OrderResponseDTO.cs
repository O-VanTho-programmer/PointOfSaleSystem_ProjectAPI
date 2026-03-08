public class OrderResponseDTO
{
    public int OrderId { get; set; }
    public int Status { get; set; }
    public int? DiscountId { get; set; }
    public int? UsserId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? TableNumber { get; set; }
    //0: dine in, 1: take away, 2: delivery
    public int? OrderType { get; set; }
    public List<OrderItemResponseDTO> OrderItems { get; set; }
}
