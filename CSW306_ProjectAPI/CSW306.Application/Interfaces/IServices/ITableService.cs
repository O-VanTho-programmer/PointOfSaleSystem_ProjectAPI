using CSW306.Application.DTO.Upload;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface ITableService
    {
        Task<TemplateApi<Table>> GetAllTablesAsync();
        Task<TemplateApi<Table>> GetTableByIdAsync(int id);
        Task<TemplateApi<Table>> CreateTableAsync(TableCreateDTO dto);
        Task<TemplateApi<Table>> UpdateTableAsync(int id, TableCreateDTO dto);
        Task<TemplateApi<Table>> DeleteTableAsync(int id);
    }
}
