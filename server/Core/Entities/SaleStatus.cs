namespace Core.Entities
{
    public class SaleStatus
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; 
        public List<Sale> Sales { get; set; } = new();
    }
}