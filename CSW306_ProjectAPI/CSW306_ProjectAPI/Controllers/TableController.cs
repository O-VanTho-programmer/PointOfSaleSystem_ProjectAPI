using CSW306_ProjectAPI.DTO.Upload;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSW306_ProjectAPI.Controllers
{
    [Authorize(Roles = "Cashier,Manager")]
    [Route("api/[controller]")]
    [ApiController]
    public class TableController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public TableController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Table>>> Get()
        {
            return await _context.Tables.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Table>> Get(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound("table id not found");
            }
            return Ok(table);
        }

        [HttpPost]
        public async Task<ActionResult<Table>> AddTable([FromBody] TableCreateDTO dto)
        {
            if (dto == null || dto.TableId <= 0 || dto.Capacity <= 0)
            {
                return BadRequest("table data invalid");
            }

            var allowedStatuses = new[] { "available", "reserved", "occupied" };
            if (!allowedStatuses.Contains(dto.Status.ToLower()))
            {
                return BadRequest("invalid status only allowed: available, reserved, occupied");
            }

            var exists = await _context.Tables.AnyAsync(t => t.TableId == dto.TableId);
            if (exists)
            {
                return Conflict($"a table with ID {dto.TableId} already exists");
            }

            var table = new Table
            {
                TableId = dto.TableId,
                Capacity = dto.Capacity,
                Status = dto.Status
            };

            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = table.TableId }, table);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, [FromBody] TableCreateDTO dto)
        {
            if (id != dto.TableId)
            {
                return BadRequest("table id mismatch");
            }

            var existingTable = await _context.Tables.FindAsync(id);
            if (existingTable == null)
            {
                return NotFound("table id not found");
            }

            var allowedStatuses = new[] { "available", "reserved", "occupied" };
            if (!allowedStatuses.Contains(dto.Status.ToLower()))
            {
                return BadRequest("invalid status only allowed: available, reserved, occupied");
            }

            existingTable.Capacity = dto.Capacity;
            existingTable.Status = dto.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound("table id not found");
            }

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}