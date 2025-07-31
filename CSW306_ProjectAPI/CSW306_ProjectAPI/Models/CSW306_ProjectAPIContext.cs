using Microsoft.EntityFrameworkCore;


namespace CSW306_ProjectAPI.Models
{
    public class CSW306_ProjectAPIContext : DbContext
    {
        public CSW306_ProjectAPIContext(DbContextOptions<CSW306_ProjectAPIContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
    }
}
