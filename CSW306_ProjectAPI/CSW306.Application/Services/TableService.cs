using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class TableService : ITableService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditLogService _auditLogService;

        private static readonly string[] AllowedStatuses = { "available", "reserved", "occupied" };

        public TableService(IUnitOfWork unitOfWork, IAuditLogService auditLogService)
        {
            _unitOfWork = unitOfWork;
            _auditLogService = auditLogService;
        }

        public async Task<TemplateApi<Table>> GetAllTablesAsync()
        {
            try
            {
                var tables = await _unitOfWork.Tables.GetAllAsync();
                var countRecord = tables.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, tables, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetAllTablesError", "Table", null, null, $"Exception: {ex.Message}");
                return new TemplateApi<Table>(null, null, "An unexpected error occurred while fetching tables.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Table>> GetTableByIdAsync(int id)
        {
            try
            {
                var table = await _unitOfWork.Tables.GetByIdAsync(id);
                if (table == null)
                {
                    return new TemplateApi<Table>(null, null, "Table not found", false, 0, 0, 0, 0);
                }
                return new Pagination().HandleGetByIdRespond(table);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetTableByIdError", "Table", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Table>(null, null, "An unexpected error occurred while fetching table.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Table>> CreateTableAsync(TableCreateDTO dto)
        {
            try
            {
                if (dto == null || dto.TableId <= 0 || dto.Capacity <= 0)
                {
                    return new TemplateApi<Table>(null, null, "table data invalid or invalid status only allowed: available, reserved, occupied", false, 0, 0, 0, 0);
                }

                if (!AllowedStatuses.Contains(dto.Status.ToLower()))
                {
                    return new TemplateApi<Table>(null, null, "invalid status only allowed: available, reserved, occupied", false, 0, 0, 0, 0);
                }

                var exists = await _unitOfWork.Tables.TableExistsAsync(dto.TableId);
                if (exists)
                {
                    return new TemplateApi<Table>(null, null, $"a table with ID {dto.TableId} already exists", false, 0, 0, 0, 0);
                }

                var table = new Table
                {
                    TableId = dto.TableId,
                    Capacity = dto.Capacity,
                    Status = dto.Status
                };

                await _unitOfWork.Tables.AddAsync(table);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("CreateTable", "Table", table.TableId, null, $"Capacity: {table.Capacity}, Status: {table.Status}");

                return new Pagination().HandleGetByIdRespond(table);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("CreateTableError", "Table", dto?.TableId, null, $"Exception: {ex.Message}");
                return new TemplateApi<Table>(null, null, "An unexpected error occurred while creating table.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Table>> UpdateTableAsync(int id, TableCreateDTO dto)
        {
            try
            {
                if (id != dto.TableId || dto.Capacity <= 0)
                {
                    return new TemplateApi<Table>(null, null, "table data invalid", false, 0, 0, 0, 0);
                }

                if (!AllowedStatuses.Contains(dto.Status.ToLower()))
                {
                    return new TemplateApi<Table>(null, null, "invalid status", false, 0, 0, 0, 0);
                }

                var existingTable = await _unitOfWork.Tables.GetByIdAsync(id);
                if (existingTable == null)
                {
                    return new TemplateApi<Table>(null, null, "table id not found", false, 0, 0, 0, 0);
                }

                existingTable.Capacity = dto.Capacity;
                existingTable.Status = dto.Status;

                await _unitOfWork.Tables.UpdateAsync(existingTable);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("UpdateTable", "Table", existingTable.TableId, null, $"Capacity: {existingTable.Capacity}, Status: {existingTable.Status}");

                return new Pagination().HandleGetByIdRespond(existingTable);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("UpdateTableError", "Table", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Table>(null, null, "An unexpected error occurred while updating table.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Table>> DeleteTableAsync(int id)
        {
            try
            {
                var table = await _unitOfWork.Tables.GetByIdAsync(id);
                if (table == null)
                {
                    return new TemplateApi<Table>(null, null, "table id not found", false, 0, 0, 0, 0);
                }

                await _unitOfWork.Tables.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("DeleteTable", "Table", id, null, $"Deleted Table {id}");

                return new TemplateApi<Table>(table, null, "Table deleted successfully", true, 0, 0, 0, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("DeleteTableError", "Table", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Table>(null, null, "An unexpected error occurred while deleting table.", false, 0, 0, 0, 0);
            }
        }
    }
}
