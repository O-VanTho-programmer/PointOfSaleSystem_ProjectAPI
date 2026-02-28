using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IRepositories;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Linq;

namespace CSW306.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Items?> AssignItemToCategoryAsync(int itemId, int categoryId)
        {
            var item = await _unitOfWork.Items.GetByIdAsync(itemId);
            var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);

            if (item == null || category == null)
            {
                return null;
            }

            item.CategoryId = categoryId;
            item.Category = category;

            await _unitOfWork.Items.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();
            return item;
        }

        public async Task<Categories> CreateCategoryAsync(CategoryUploadDTO dto)
        {
            var category = new Categories
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var result = await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            return result;
        }

        public async Task<TemplateApi<Categories>> GetCategoriesAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _unitOfWork.Categories.CountAsync();
            var categories = await _unitOfWork.Categories.GetPagedAsync(pageNumber, pageSize);
            var pagination = new Pagination();
            return pagination.HandlePagedRespond(pageNumber, pageSize, categories, totalCount);
        }

        public async Task<TemplateApi<Categories>> GetCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(category);
        }
    }
}
