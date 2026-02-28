using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthsController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthsController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("customer/register")]
        public async Task<ActionResult<Users>> RegisterCustomer([FromForm] RegisterCustomerDTO dto)
        {
            var newCustomer = await _authService.RegisterCustomerAsync(dto);
            return Ok(newCustomer);
        }

        [HttpPost("employee/register")]
        public async Task<ActionResult<Users>> RegisterEmployee([FromForm] RegisterEmployeeDTO dto)
        {
            var newEmployee = await _authService.RegisterEmployeeAsync(dto);
            return Ok(newEmployee);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromForm] LoginRequestDTO request)
        {
            var token = await _authService.LoginAsync(request);
            if (token == null)
            {
                return Unauthorized();
            }

            return Ok(new { Token = token });
        }
    }
}
