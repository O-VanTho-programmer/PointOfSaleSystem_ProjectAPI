using CSW306.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;

namespace CSW306.Infrastructure.Services
{
    public class CurrentUserProvider : ICurrentUserProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? GetCurrentUserId()
        {
            try
            {
                var userClaim = _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
                if (userClaim != null && int.TryParse(userClaim.Value, out var userId))
                {
                    return userId;
                }
            }
            catch { /* HttpContext may not be available in non-HTTP contexts */ }

            return null;
        }

        public string? GetCurrentUserName()
        {
            try
            {
                var nameClaim = _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.Name);
                return nameClaim?.Value;
            }
            catch { }

            return null;
        }

        public string? GetCurrentUserRole()
        {
            try
            {
                var roleClaim = _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.Role);
                return roleClaim?.Value;
            }
            catch { }

            return null;
        }
    }
}
