using Core.Entities;

namespace Core.Interfaces
{
    public interface ISaleRepository
    {
        Task<Sale> AddAsync(Sale sale);
        Task<IEnumerable<Sale>> GetByDateRangeAsync(DateTime from, DateTime to);
        Task<Sale?> GetByIdAsync(int id);
        Task<Sale> UpdateAsync(Sale sale);
        Task<bool> DeleteAsync(int id);
    }
}
