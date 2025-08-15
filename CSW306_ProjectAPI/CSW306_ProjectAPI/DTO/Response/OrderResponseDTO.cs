public class OrderResponseDTO
{
    public int OrderId { get; set; }
    public int Status { get; set; }
    public int? DiscountId { get; set; }
    public int? UsserId { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<OrderItemResponseDTO> OrderItems { get; set; }
}