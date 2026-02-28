using CSW306.Application.DTO.Upload;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface ITableService
    {
        Task<IEnumerable<Table>> GetAllTablesAsync();
        Task<Table?> GetTableByIdAsync(int id);
        Task<Table?> CreateTableAsync(TableCreateDTO dto);
        Task<Table?> UpdateTableAsync(int id, TableCreateDTO dto);
        Task<bool> DeleteTableAsync(int id);
    }
}
