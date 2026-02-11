using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _repo;
        public ProductService(IProductRepository repo) => _repo = repo;

        public Task<IEnumerable<Product>> GetAllAsync() => _repo.GetAllAsync();
        public Task<Product?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);
        public Task<Product> AddAsync(Product product) => _repo.AddAsync(product);
        public Task<Product> UpdateAsync(Product product) => _repo.UpdateAsync(product);
        public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}
