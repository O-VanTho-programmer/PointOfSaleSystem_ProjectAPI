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
        private readonly IRedisCacheService _redisCacheService;

        public CategoryService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService)
        {
            _unitOfWork = unitOfWork;
            _redisCacheService = redisCacheService;
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
            await _redisCacheService.SetAsync("item:" + itemId, item);
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

            await _redisCacheService.RemoveAsync("categories");
            await _redisCacheService.SetAsync("category:" + result.CategoryId, result);
            return result;
        }

        public async Task<TemplateApi<Categories>> GetCategoriesAsync(int pageNumber, int pageSize)
        {
            var cachedCategories = await _redisCacheService.GetAsync<IEnumerable<Categories>>("categories");

            if(cachedCategories == null){
                cachedCategories = await _unitOfWork.Categories.GetAllAsync();
                await _redisCacheService.SetAsync("categories", cachedCategories);
            }

            var totalCount = cachedCategories.Count();
            var pagedCategories = cachedCategories.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            
            var pagination = new Pagination();
            return pagination.HandlePagedRespond(pageNumber, pageSize, pagedCategories.ToList(), totalCount);
        }

        public async Task<TemplateApi<Categories>> GetCategoryAsync(int id)
        {
            var cachedCategory = await _redisCacheService.GetAsync<Categories>("category:" + id);

            if(cachedCategory != null){
                return new TemplateApi<Categories>(cachedCategory, null, "Category found in cache", true, 0, 0, 0, 0);
            }

            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if(category != null){
                await _redisCacheService.SetAsync("category:" + id, category);
            }

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(category);
        }

        public async Task<TemplateApi<Categories>> UpdateCategoryAsync(int id, CategoryUploadDTO dto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return new TemplateApi<Categories>(null, null, "Category not found", false, 0, 0, 0, 0);
            }

            category.Name = dto.Name;
            category.Description = dto.Description;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("categories");
            await _redisCacheService.SetAsync("category:" + id, category);

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(category);
        }

        public async Task<TemplateApi<Categories>> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return new TemplateApi<Categories>(null, null, "Category not found", false, 0, 0, 0, 0);
            }

            await _unitOfWork.Categories.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("categories");
            await _redisCacheService.RemoveAsync("category:" + id);

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(category);
        }
    }
}
