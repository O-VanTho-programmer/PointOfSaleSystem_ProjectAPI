using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Repositories
{
    public class ReservationRepository : GenericRepository<Reservation>, IReservationRepository
    {
        public ReservationRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<bool> IsTableReservedAsync(int tableId, DateTime date, DateTime time, int? excludeReservationId = null)
        {
            var query = _dbSet.Where(r => r.TableId == tableId && r.Date == date && r.Time == time);
            
            if (excludeReservationId.HasValue)
            {
                query = query.Where(r => r.ReservationId != excludeReservationId.Value);
            }

            return await query.AnyAsync();
        }
    }
}
