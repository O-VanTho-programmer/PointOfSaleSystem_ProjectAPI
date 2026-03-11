using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IUserService
    {
        Task<TemplateApi<Users>> GetAllUsersAsync();
        Task<TemplateApi<Users>> CreateUserAsync(Users user);
    }
}
