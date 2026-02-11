using Microsoft.EntityFrameworkCore;
using Core.Entities;

namespace Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<SaleDetail> SaleDetails => Set<SaleDetail>();
        public DbSet<SaleStatus> SaleStatuses => Set<SaleStatus>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SaleStatus>().HasData(
                new SaleStatus { Id = 1, Name = "Pendiente" },
                new SaleStatus { Id = 2, Name = "Completada" },
                new SaleStatus { Id = 3, Name = "Cancelada" }
            );
        }
    }
}
