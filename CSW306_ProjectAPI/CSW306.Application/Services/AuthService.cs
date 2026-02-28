using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<string?> LoginAsync(LoginRequestDTO request)
        {
            var user = await _unitOfWork.Users.GetUserByPhoneAndPasswordAsync(request.Phone, request.Password);
            if (user == null)
            {
                return null;
            }

            return GenerateJwtToken(user);
        }

        public async Task<Users?> RegisterCustomerAsync(RegisterCustomerDTO dto)
        {
            var newCustomer = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                Phone = dto.Phone,
                Role = "Customer",
            };

            await _unitOfWork.Users.AddAsync(newCustomer);
            await _unitOfWork.SaveChangesAsync();

            return newCustomer;
        }

        public async Task<Users?> RegisterEmployeeAsync(RegisterEmployeeDTO dto)
        {
            var newEmployee = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                Phone = dto.Phone,
                Role = dto.Role,
            };

            await _unitOfWork.Users.AddAsync(newEmployee);
            await _unitOfWork.SaveChangesAsync();

            return newEmployee;
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
