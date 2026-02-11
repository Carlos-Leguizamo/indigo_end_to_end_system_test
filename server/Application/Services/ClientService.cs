using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class ClientService
    {
        private readonly IClientRepository _repo;

        public ClientService(IClientRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<Client>> GetAllAsync() => _repo.GetAllAsync();

        public Task<Client?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        public Task<Client> AddAsync(Client client) => _repo.AddAsync(client);

        public Task<Client> UpdateAsync(Client client) => _repo.UpdateAsync(client);

        public Task DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}
