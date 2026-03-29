using CSW306.Application.DTO.Upload;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface ICategoryService
    {
        Task<TemplateApi<Categories>> GetCategoriesAsync(int? pageNumber, int? pageSize);
        Task<TemplateApi<Categories>> GetCategoryAsync(int id);
        Task<Categories> CreateCategoryAsync(CategoryUploadDTO dto);
        Task<TemplateApi<Categories>> UpdateCategoryAsync(int id, CategoryUploadDTO dto);
        Task<TemplateApi<Categories>> DeleteCategoryAsync(int id);
        Task<Items?> AssignItemToCategoryAsync(int itemId, int categoryId);
    }
}
