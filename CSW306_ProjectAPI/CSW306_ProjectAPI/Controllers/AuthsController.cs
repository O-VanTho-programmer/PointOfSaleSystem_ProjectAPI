using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
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

        //[HttpPost("customer/register")]
        //public async Task<ActionResult<Users>> RegisterCustomer([FromBody] RegisterCustomerDTO dto)
        //{
        //    var newCustomer = await _authService.RegisterCustomerAsync(dto);
        //    return Ok(newCustomer);
        //}

        [HttpPost("employee/register")]
        [Authorize(Roles ="Manager")]
        public async Task<ActionResult<Users>> RegisterEmployee([FromBody] RegisterEmployeeDTO dto)
        {
            var newEmployee = await _authService.RegisterEmployeeAsync(dto);
            return Ok(newEmployee);
        }

        
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestDTO request)
        {
            var authResult = await _authService.LoginAsync(request);
            if (authResult == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid phone number or passwork. Please try again"
                });
            }

            return Ok(new
            {
                Token = authResult.Token,
                User = authResult.User
            });
        }
    }
}
