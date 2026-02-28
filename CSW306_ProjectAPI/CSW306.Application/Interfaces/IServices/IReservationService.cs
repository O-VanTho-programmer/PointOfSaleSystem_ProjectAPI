using CSW306.Application.DTO.Upload;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IReservationService
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync();
        Task<Reservation?> GetReservationByIdAsync(int id);
        Task<(Reservation? Reservation, string? ErrorMessage)> CreateReservationAsync(ReservationCreateDTO dto);
        Task<(Reservation? Reservation, string? ErrorMessage)> UpdateReservationAsync(int id, ReservationCreateDTO dto);
        Task<bool> DeleteReservationAsync(int id);
    }
}
