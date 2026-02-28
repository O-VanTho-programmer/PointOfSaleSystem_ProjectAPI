using CSW306.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IReservationRepository : IGenericRepository<Reservation>
    {
        Task<bool> IsTableReservedAsync(int tableId, DateTime date, DateTime time, int? excludeReservationId = null);
    }
}
