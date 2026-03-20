using CSW306.Domain.Entities;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface ITableRepository : IGenericRepository<Table>
    {
        Task<IEnumerable<Table>> GetTablesSort();
        Task<bool> TableExistsAsync(int tableId);
    }
}
