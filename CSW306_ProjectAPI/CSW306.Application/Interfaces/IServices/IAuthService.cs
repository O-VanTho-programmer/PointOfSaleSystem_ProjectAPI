using CSW306.Application.DTO.Response;
using CSW306.Application.DTO.Upload;
using CSW306.Domain.Entities;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<Users?> RegisterCustomerAsync(RegisterCustomerDTO dto);
        Task<Users?> RegisterEmployeeAsync(RegisterEmployeeDTO dto);
        Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request);
    }
}
