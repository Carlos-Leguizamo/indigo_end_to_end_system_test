public class CreateSaleDto
{
    public int ClientId { get; set; }  
    public List<SaleItemDto> Items { get; set; } = new();
}

public class SaleItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
