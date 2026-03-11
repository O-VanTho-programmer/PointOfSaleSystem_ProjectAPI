using CSW306.Application.DTO.Upload;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IReservationService
    {
        Task<TemplateApi<Reservation>> GetAllReservationsAsync();
        Task<TemplateApi<Reservation>> GetReservationByIdAsync(int id);
        Task<TemplateApi<Reservation>> CreateReservationAsync(ReservationCreateDTO dto);
        Task<TemplateApi<Reservation>> UpdateReservationAsync(int id, ReservationCreateDTO dto);
        Task<TemplateApi<Reservation>> DeleteReservationAsync(int id);
    }
}
