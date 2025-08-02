using CSW306_ProjectAPI.DTO;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthsController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;
        private readonly IConfiguration _configuration;

        public AuthsController(CSW306_ProjectAPIContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("customer/register")]
        public async Task<ActionResult<Users>> RegisterCustomer([FromForm] RegisterCustomerDTO dto)
        {
            var newCustomer = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                Role = "Customer",
            };

            await _context.Users.AddAsync(newCustomer);
            _context.SaveChanges();

            return Ok(newCustomer);
        }

        [HttpPost("employee/register")]
        public async Task<ActionResult<Users>> RegisterEmployee([FromForm] RegisterEmployeeDTO dto)
        {
            var newEmpoyee = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                Role = dto.Role,
            };

            await _context.Users.AddAsync(newEmpoyee);
            _context.SaveChanges();

            return Ok(newEmpoyee);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromForm] LoginRequestDTO request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == request.Phone && u.Password == request.Password);
            if (user == null)
                return Unauthorized();

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
