public class OrderItemResponseDTO
{
    public int ItemId { get; set; }
    public int OrderId { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtOrder { get; set; }
    public ItemResponseDTO Item { get; set; }
}