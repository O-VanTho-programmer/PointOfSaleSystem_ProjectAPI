using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<TemplateApi<Categories>>> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _categoryService.GetCategoriesAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Categories>>> GetCategory(int id)
        {
            var result = await _categoryService.GetCategoryAsync(id);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]

        public async Task<ActionResult<Categories>> CreateCategory([FromBody] CategoryUploadDTO dto)
        {
            var category = await _categoryService.CreateCategoryAsync(dto);
            return Ok(category);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<TemplateApi<Categories>>> UpdateCategory(int id, [FromBody] CategoryUploadDTO dto)
        {
            var result = await _categoryService.UpdateCategoryAsync(id, dto);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<TemplateApi<Categories>>> DeleteCategory(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("assign-item")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> AssginItemToCategory([FromBody] int ItemId, int CategoryId)
        {
            var item = await _categoryService.AssignItemToCategoryAsync(ItemId, CategoryId);

            if (item == null) {
                return BadRequest("Invalid Item Id or Category Id");
            }

            return Ok(item);
        }
    }
}
