using CSW306.Domain.Entities;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IUserRepository : IGenericRepository<Users>
    {
        Task<Users?> GetUserByPhoneAndPasswordAsync(string phone, string password);
    }
}
