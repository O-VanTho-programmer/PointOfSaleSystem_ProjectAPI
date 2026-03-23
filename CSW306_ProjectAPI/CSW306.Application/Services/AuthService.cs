using CSW306.Application.DTO.Response;
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
        private readonly ICurrentUserProvider _currentUserProvider;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration, ICurrentUserProvider currentUserProvider)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _currentUserProvider = currentUserProvider;
        }

        public async Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO request)
        {
            var user = await _unitOfWork.Users.GetUserByPhoneAndPasswordAsync(request.Phone, request.Password);
            if (user == null)
            {
                return null;
            }

            var response = new LoginResponseDTO{
                Token = GenerateJwtToken(user),
                User = new UserSessionDTO{
                    UserId = user.UserId,
                    Phone = user.Phone,
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role.ToString()
                }
            };

            Users? currentUser = null;
            try
            {
                currentUser = await _unitOfWork.Users.GetByIdAsync(user.UserId);
            }
            catch { /* ignore */ }
            string userDescriptor;

            if (currentUser != null && !string.IsNullOrWhiteSpace(currentUser.Name))
            {
                var role = string.IsNullOrWhiteSpace(currentUser.Role) ? "Staff" : currentUser.Role;
                userDescriptor = $"{role} {currentUser.Name}";
            }
            else
            {
                userDescriptor = $"Staff #{user.UserId}";
            }

            var createDetails = $"{userDescriptor} login successfully.";

            await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
            {
                Action = "Login",
                EntityName = "User",
                EntityId = user.UserId,
                UserId = user.UserId,
                Details = createDetails,
                Timestamp = DateTimeOffset.UtcNow
            });

            await _unitOfWork.SaveChangesAsync();

            return response;
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

            var performingUserId = _currentUserProvider?.GetCurrentUserId();
            if (performingUserId.HasValue)
            {
                try
                {
                    var performingUser = await _unitOfWork.Users.GetByIdAsync(performingUserId.Value);
                    var performerName = performingUser?.Name ?? $"User #{performingUserId}";
                    var performerRole = performingUser?.Role ?? "Staff";

                    var registrationDetails = $"{performerRole} {performerName} registered customer {newCustomer.Name} ({newCustomer.Phone}).";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "RegisterCustomer",
                        EntityName = "User",
                        EntityId = newCustomer.UserId,
                        UserId = performingUserId.Value,
                        Details = registrationDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* Log silently fails; registration still succeeds */ }
            }

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

            var performingUserId = _currentUserProvider?.GetCurrentUserId();
            if (performingUserId.HasValue)
            {
                try
                {
                    var performingUser = await _unitOfWork.Users.GetByIdAsync(performingUserId.Value);
                    var performerName = performingUser?.Name ?? $"User #{performingUserId}";
                    var performerRole = performingUser?.Role ?? "Staff";

                    var registrationDetails = $"{performerRole} {performerName} registered employee {newEmployee.Name} as {newEmployee.Role}.";

                    await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                    {
                        Action = "RegisterEmployee",
                        EntityName = "User",
                        EntityId = newEmployee.UserId,
                        UserId = performingUserId.Value,
                        Details = registrationDetails,
                        Timestamp = DateTimeOffset.UtcNow
                    });

                    await _unitOfWork.SaveChangesAsync();
                }
                catch { /* Log silently fails; registration still succeeds */ }
            }

            return newEmployee;
        }

        private string GenerateJwtToken(Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
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
