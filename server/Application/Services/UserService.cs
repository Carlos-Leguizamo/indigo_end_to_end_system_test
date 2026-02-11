using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public Task<User?> GetByUsernameAsync(string username) => _repo.GetByUsernameAsync(username);

        public Task<User?> GetByEmailAsync(string email) => _repo.GetByEmailAsync(email);

        public Task<User> AddAsync(User user) => _repo.AddAsync(user);

        public Task<User?> GetByUsernameOrEmailAsync(string username, string email) => _repo.GetByUsernameOrEmailAsync(username, email);
    }
}