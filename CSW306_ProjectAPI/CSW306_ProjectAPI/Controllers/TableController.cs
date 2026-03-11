using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
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
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<TemplateApi<Table>>> Get()
        {
            var tables = await _tableService.GetAllTablesAsync();
            return Ok(tables);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Table>>> Get(int id)
        {
            var table = await _tableService.GetTableByIdAsync(id);
            if (!table.Success)
            {
                return NotFound(table);
            }
            return Ok(table);
        }

        [HttpPost]
        public async Task<ActionResult<TemplateApi<Table>>> AddTable([FromBody] TableCreateDTO dto)
        {
            var table = await _tableService.CreateTableAsync(dto);

            if (!table.Success)
            {
                if (table.Message.Contains("already exists"))
                    return Conflict(table);
                return BadRequest(table);
            }

            return CreatedAtAction(nameof(Get), new { id = table.Payload!.TableId }, table);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, [FromBody] TableCreateDTO dto)
        {
            var table = await _tableService.UpdateTableAsync(id, dto);

            if (!table.Success)
            {
                if (table.Message.Contains("not found"))
                    return NotFound(table);
                return BadRequest(table);
            }

            return Ok(table);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var result = await _tableService.DeleteTableAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
