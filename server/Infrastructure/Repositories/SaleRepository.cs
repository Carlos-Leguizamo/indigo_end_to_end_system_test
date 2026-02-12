using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SaleRepository : ISaleRepository
    {
        private readonly AppDbContext _context;
        public SaleRepository(AppDbContext context) => _context = context;

        public async Task<Sale> AddAsync(Sale sale)
        {
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            
            await _context.Entry(sale)
                .Collection(s => s.Items)
                .LoadAsync();
            
            foreach (var item in sale.Items)
            {
                await _context.Entry(item)
                    .Reference(i => i.Product)
                    .LoadAsync();
            }
            
            return sale;
        }

        public async Task<IEnumerable<Sale>> GetByDateRangeAsync(DateTime from, DateTime to) =>
            await _context.Sales
                .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                .Include(s => s.Client)
                .Where(s => s.Date >= from && s.Date <= to)
                .ToListAsync();


        public async Task<Sale?> GetByIdAsync(int id) =>
            await _context.Sales
                .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                .Include(s => s.Client)
                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task<Sale> UpdateAsync(Sale sale)
        {
            _context.Sales.Update(sale);
            await _context.SaveChangesAsync();
            return sale;
        }

public async Task<bool> DeleteAsync(int id)
{
    var sale = await _context.Sales.FindAsync(id);
    if (sale != null)
    {
        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();
        return true; // Se eliminó exitosamente
    }
    return false; // No se encontró la venta
}
    }
}