public class SaleResponseDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public decimal Total { get; set; }
    public List<SaleItemResponseDto> Items { get; set; } = new();
}

public class SaleItemResponseDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
