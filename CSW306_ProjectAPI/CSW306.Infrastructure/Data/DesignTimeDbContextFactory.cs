using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace CSW306.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<CSW306_ProjectAPIContext>
    {
        public CSW306_ProjectAPIContext CreateDbContext(string[] args)
        {
            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "CSW306_ProjectAPI");
            
            if (!Directory.Exists(apiProjectPath))
            {
                apiProjectPath = Directory.GetCurrentDirectory();
            }
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true) 
                .AddEnvironmentVariables() 
                .Build();

            var connStr = configuration.GetConnectionString("DBConnection");

            var optionsBuilder = new DbContextOptionsBuilder<CSW306_ProjectAPIContext>();
            optionsBuilder.UseNpgsql(connStr);
            return new CSW306_ProjectAPIContext(optionsBuilder.Options, null);
        }
    }
}