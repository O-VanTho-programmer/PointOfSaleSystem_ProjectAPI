using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class TableService : ITableService
    {
        private readonly IUnitOfWork _unitOfWork;

        private static readonly string[] AllowedStatuses = { "available", "reserved", "occupied" };

        public TableService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Table>> GetAllTablesAsync()
        {
            return await _unitOfWork.Tables.GetAllAsync();
        }

        public async Task<Table?> GetTableByIdAsync(int id)
        {
            return await _unitOfWork.Tables.GetByIdAsync(id);
        }

        public async Task<Table?> CreateTableAsync(TableCreateDTO dto)
        {
            if (dto == null || dto.TableId <= 0 || dto.Capacity <= 0)
            {
                return null;
            }

            if (!AllowedStatuses.Contains(dto.Status.ToLower()))
            {
                // Can ideally throw custom exception here but returning null to signify bad request to controller
                return null; 
            }

            var exists = await _unitOfWork.Tables.TableExistsAsync(dto.TableId);
            if (exists)
            {
                // Signifies conflict
                return new Table { TableId = -1 }; 
            }

            var table = new Table
            {
                TableId = dto.TableId,
                Capacity = dto.Capacity,
                Status = dto.Status
            };

            await _unitOfWork.Tables.AddAsync(table);
            await _unitOfWork.SaveChangesAsync();

            return table;
        }

        public async Task<Table?> UpdateTableAsync(int id, TableCreateDTO dto)
        {
            if (id != dto.TableId || dto.Capacity <= 0)
            {
                return null;
            }

            if (!AllowedStatuses.Contains(dto.Status.ToLower()))
            {
                return null;
            }

            var existingTable = await _unitOfWork.Tables.GetByIdAsync(id);
            if (existingTable == null)
            {
                return new Table { TableId = -1 }; // signifies not found
            }

            existingTable.Capacity = dto.Capacity;
            existingTable.Status = dto.Status;

            await _unitOfWork.Tables.UpdateAsync(existingTable);
            await _unitOfWork.SaveChangesAsync();

            return existingTable;
        }

        public async Task<bool> DeleteTableAsync(int id)
        {
            var table = await _unitOfWork.Tables.GetByIdAsync(id);
            if (table == null)
            {
                return false;
            }

            await _unitOfWork.Tables.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
