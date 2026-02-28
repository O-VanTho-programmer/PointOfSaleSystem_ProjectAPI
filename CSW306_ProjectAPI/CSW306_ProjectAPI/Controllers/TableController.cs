using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Authorize(Roles = "Cashier,Manager")]
    [Route("api/[controller]")]
    [ApiController]
    public class TableController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TableController(ITableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Table>>> Get()
        {
            var tables = await _tableService.GetAllTablesAsync();
            return Ok(tables);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Table>> Get(int id)
        {
            var table = await _tableService.GetTableByIdAsync(id);
            if (table == null)
            {
                return NotFound("table id not found");
            }
            return Ok(table);
        }

        [HttpPost]
        public async Task<ActionResult<Table>> AddTable([FromBody] TableCreateDTO dto)
        {
            var table = await _tableService.CreateTableAsync(dto);

            if (table == null)
            {
                return BadRequest("table data invalid or invalid status only allowed: available, reserved, occupied");
            }

            if (table.TableId == -1)
            {
                return Conflict($"a table with ID {dto.TableId} already exists");
            }

            return CreatedAtAction(nameof(Get), new { id = table.TableId }, table);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, [FromBody] TableCreateDTO dto)
        {
            var table = await _tableService.UpdateTableAsync(id, dto);

            if (table == null)
            {
                return BadRequest("table data invalid or invalid status");
            }

            if (table.TableId == -1)
            {
                return NotFound("table id not found");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var success = await _tableService.DeleteTableAsync(id);
            if (!success)
            {
                return NotFound("table id not found");
            }

            return NoContent();
        }
    }
}
