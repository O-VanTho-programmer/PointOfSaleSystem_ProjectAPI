using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface ICurrentUserProvider
    {
         int? GetCurrentUserId();
         string? GetCurrentUserName();
         string? GetCurrentUserRole();
    }
}
