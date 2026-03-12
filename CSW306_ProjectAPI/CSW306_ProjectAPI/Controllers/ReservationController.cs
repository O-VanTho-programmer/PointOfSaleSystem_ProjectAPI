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
    [Authorize(Roles = "Manager,Waiter,Cashier")]
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
        public async Task<ActionResult<TemplateApi<Reservation>>> Get()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Reservation>>> Get(int id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (!reservation.Success)
            {
                return NotFound(reservation);
            }
            return Ok(reservation);
        }

        [AllowAnonymous]
        [HttpPost(Name = "BookTable")]
        public async Task<ActionResult<TemplateApi<Reservation>>> AddReservation([FromBody] ReservationCreateDTO dto)
        {
            var reservation = await _reservationService.CreateReservationAsync(dto);

            if (!reservation.Success)
            {
                if (reservation.Message == "table dont exist") return NotFound(reservation);
                return BadRequest(reservation);
            }

            return CreatedAtAction(nameof(Get), new { id = reservation.Payload!.ReservationId }, reservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] ReservationCreateDTO dto)
        {
            var reservation = await _reservationService.UpdateReservationAsync(id, dto);

            if (!reservation.Success)
            {
                if (reservation.Message == "reservation id not found" || reservation.Message == "table dont exist") return NotFound(reservation);
                return BadRequest(reservation);
            }

            return Ok(reservation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var result = await _reservationService.DeleteReservationAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
