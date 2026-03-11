using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditLogService _auditLogService;

        public UserService(IUnitOfWork unitOfWork, IAuditLogService auditLogService)
        {
            _unitOfWork = unitOfWork;
            _auditLogService = auditLogService;
        }

        public async Task<TemplateApi<Users>> GetAllUsersAsync()
        {
            try
            {
                var users = await _unitOfWork.Users.GetAllAsync();
                var countRecord = users.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, users, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetAllUsersError", "User", null, null, $"Exception: {ex.Message}");
                return new TemplateApi<Users>(null, null, "An unexpected error occurred while fetching users.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Users>> CreateUserAsync(Users user)
        {
            try
            {
                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("CreateUser", "User", user.UserId, null, $"Phone: {user.Phone}");

                return new Pagination().HandleGetByIdRespond(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("CreateUserError", "User", user?.UserId, null, $"Exception: {ex.Message}");
                return new TemplateApi<Users>(null, null, "An unexpected error occurred while creating a user.", false, 0, 0, 0, 0);
            }
        }
    }
}
