using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Sale
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public int ClientId { get; set; }
        public int SaleStatusId { get; set; }
        public decimal Total { get; set; }

        [ForeignKey("ClientId")]
        public Client Client { get; set; } = null!;

        [ForeignKey("SaleStatusId")]
        public SaleStatus Status { get; set; } = null!;

        public List<SaleDetail> Items { get; set; } = new();
    }
}