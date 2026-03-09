using Microsoft.EntityFrameworkCore;
using CSW306.Domain.Entities;

namespace CSW306.Infrastructure.Data
{
    public class CSW306_ProjectAPIContext : DbContext
    {
        public CSW306_ProjectAPIContext(DbContextOptions<CSW306_ProjectAPIContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> OrderItems { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<Discounts> Discounts { get; set; }
        public DbSet<Payments> Payments { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderItems>()
                .HasKey(oi => new { oi.OrderId, oi.ItemId });
        }
    }
}
