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

        public async Task<List<Sale>> GetAllSalesAsync()
        {
            var sales = await _repo.GetAllAsync();
            return sales.ToList();
        }

        public Task<IEnumerable<Sale>> GetSalesByDateRangeAsync(DateTime from, DateTime to)
        {
            return _repo.GetByDateRangeAsync(from, to);
        }

        public async Task<Sale?> GetSaleByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Sale> UpdateSaleAsync(Sale sale)
        {
            sale.Total = sale.Items.Sum(i => i.Price * i.Quantity);
            return await _repo.UpdateAsync(sale);
        }

        public async Task<bool> DeleteSaleAsync(int id)
        {
            return await _repo.DeleteAsync(id);
        }
    }
}