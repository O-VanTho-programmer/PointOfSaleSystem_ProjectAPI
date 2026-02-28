using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<Users>, IUserRepository
    {
        public UserRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<Users?> GetUserByPhoneAndPasswordAsync(string phone, string password)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Phone == phone && u.Password == password);
        }
    }
}
