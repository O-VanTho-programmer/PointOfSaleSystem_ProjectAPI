using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Repositories
{
    public class TableRepository : GenericRepository<Table>, ITableRepository
    {
        public TableRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<bool> TableExistsAsync(int tableId)
        {
            return await _dbSet.AnyAsync(t => t.TableId == tableId);
        }
    }
}
