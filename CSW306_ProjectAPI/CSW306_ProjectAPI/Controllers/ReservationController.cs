using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public ReservationController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> Get()
        {
            return await _context.Reservations.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> Get(int id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.ReservationId == id);
            if (reservation == null)
            {
                return NotFound("reservation id invalid");
            }
            return Ok(reservation);
        }

        [HttpPost]
        public async Task<ActionResult<Reservation>> AddReservation([FromBody] ReservationCreateDTO dto)
        {
            if (dto == null || dto.TableId <= 0)
            {
                return BadRequest("reservation id not found");
            }

            var table = await _context.Tables.FindAsync(dto.TableId);
            if (table == null)
            {
                return NotFound("table dont exist");
            }

            if (dto.NumberOfPeople > table.Capacity)
            {
                return BadRequest($"table capacity exceeded ({table.Capacity})");
            }

            bool exists = await _context.Reservations.AnyAsync(r => r.TableId == dto.TableId && r.Date == dto.Date && r.Time == dto.Time);
            if (exists)
            {
                return BadRequest("table is already reserved");
            }

            DateTime now = DateTime.Now;
            DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
            table.Status = reservationDateTime > now ? "Reserved" : "Occupied";

            var reservation = new Reservation
            {
                ReservationId = dto.ReservationId,
                TableId = dto.TableId,
                NumberOfPeople = dto.NumberOfPeople,
                Note = dto.Note,
                Time = dto.Time,
                Date = dto.Date,
                CustomerName = dto.CustomerName
            };


            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = reservation.ReservationId }, reservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] ReservationCreateDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("reservation data is invalid");
            }

            var existingReservation = await _context.Reservations.FindAsync(id);
            if (existingReservation == null)
            {
                return NotFound("reservation id not found");
            }

            var table = await _context.Tables.FindAsync(dto.TableId);
            if (table == null)
            {
                return NotFound("table dont exist");
            }

            if (dto.NumberOfPeople > table.Capacity)
            {
                return BadRequest($"table capacity exceeded ({table.Capacity})");
            }

            bool exists = await _context.Reservations.AnyAsync(r => r.TableId == dto.TableId && r.Date == dto.Date && r.Time == dto.Time && r.ReservationId != id);
            if (exists)
            {
                return BadRequest("table is already reserved");
            }

            DateTime now = DateTime.Now;
            DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
            table.Status = reservationDateTime > now ? "Reserved" : "Occupied";

            existingReservation.TableId = dto.TableId;
            existingReservation.NumberOfPeople = dto.NumberOfPeople;
            existingReservation.Note = dto.Note;
            existingReservation.Time = dto.Time;
            existingReservation.Date = dto.Date;
            existingReservation.CustomerName = dto.CustomerName;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound("reservation id invalid");
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
