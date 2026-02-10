namespace Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Category { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public List<SaleDetail> SaleDetails { get; set; } = new();
    }
}