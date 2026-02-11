using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class SaleService
    {
        private readonly ISaleRepository _repo;

        public SaleService(ISaleRepository repo)
        {
            _repo = repo;
        }

        public async Task<Sale> AddSaleAsync(Sale sale)
        {
            sale.Total = sale.Items.Sum(i => i.Price * i.Quantity);
            return await _repo.AddAsync(sale);
        }

        public Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime from, DateTime to)
        {
            return _repo.GetByDateRangeAsync(from, to);
        }
    }
}
