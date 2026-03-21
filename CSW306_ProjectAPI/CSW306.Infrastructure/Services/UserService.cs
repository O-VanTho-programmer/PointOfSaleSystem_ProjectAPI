using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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
                return new TemplateApi<Users>(null, null, "An unexpected error occurred while fetching users.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Users>> CreateUserAsync(Users user)
        {
            try
            {
                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();

                return new Pagination().HandleGetByIdRespond(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return new TemplateApi<Users>(null, null, "An unexpected error occurred while creating a user.", false, 0, 0, 0, 0);
            }
        }
    }
}
