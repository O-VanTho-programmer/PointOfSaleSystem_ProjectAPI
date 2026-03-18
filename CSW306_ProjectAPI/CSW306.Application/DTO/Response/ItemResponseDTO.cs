public class ItemResponseDTO
{
    public int ItemId { get; set; }
    public string Name { get; set; }
    public bool IsSoldOut { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
}
