using Microsoft.EntityFrameworkCore;


namespace CSW306_ProjectAPI.Models
{
    public class CSW306_ProjectAPIContext : DbContext
    {
        public CSW306_ProjectAPIContext(DbContextOptions<CSW306_ProjectAPIContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> OrderItems { get; set; }
        public DbSet<Categories> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderItems>()
                .HasKey(oi => new { oi.OrderId, oi.ItemId });
        }
    }
}
