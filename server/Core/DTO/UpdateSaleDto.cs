public class UpdateSaleDto
{
    public int ClientId { get; set; }
    public int SaleStatusId { get; set; }
    public List<SaleItemDto> Items { get; set; } = new();
}
