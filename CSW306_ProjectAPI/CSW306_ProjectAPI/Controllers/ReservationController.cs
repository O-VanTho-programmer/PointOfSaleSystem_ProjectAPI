using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Authorize(Roles = "Manager,Employee")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> Get()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> Get(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (reservation == null)
            {
                return NotFound("reservation id invalid");
            }
            return Ok(reservation);
        }

        [HttpPost(Name = "BookTable")]
        public async Task<ActionResult<Reservation>> AddReservation([FromBody] ReservationCreateDTO dto)
        {
            var (reservation, errorMessage) = await _reservationService.CreateReservationAsync(dto);

            if (errorMessage != null)
            {
                if (errorMessage == "table dont exist") return NotFound(errorMessage);
                return BadRequest(errorMessage);
            }

            return CreatedAtAction(nameof(Get), new { id = reservation.ReservationId }, reservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] ReservationCreateDTO dto)
        {
            var (reservation, errorMessage) = await _reservationService.UpdateReservationAsync(id, dto);

            if (errorMessage != null)
            {
                if (errorMessage == "reservation id not found" || errorMessage == "table dont exist") return NotFound(errorMessage);
                return BadRequest(errorMessage);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var success = await _reservationService.DeleteReservationAsync(id);
            if (!success)
            {
                return NotFound("reservation id invalid");
            }

            return NoContent();
        }
    }
}
