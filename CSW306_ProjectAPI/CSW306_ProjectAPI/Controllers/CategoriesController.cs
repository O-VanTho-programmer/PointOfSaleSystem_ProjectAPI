using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CSW306_ProjectAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CSW306_ProjectAPI.DTO.Upload;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public CategoriesController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Categories>> GetCategories()
        {
            return _context.Categories.ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Categories>> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id);

            if (category == null)
            {
                return NotFound("Category Id not Found");
            }

            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]

        public async Task<ActionResult<Categories>> CreateCategory([FromForm] CategoryUploadDTO dto)
        {
            var category = new Categories
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpPost("assign-item")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> AssginItemToCategory([FromForm] int ItemId, int CategoryId)
        {
            var item = await _context.Items.FirstOrDefaultAsync(i => i.ItemId == ItemId);
            var category = await _context.Categories.FirstOrDefaultAsync(c =>c.CategoryId == CategoryId);

            if (item == null) {
                return NotFound("Not Found Item Id");
            }

            if (category == null) {
                return NotFound("Not Found Category Id");
            }

            item.CategoryId = CategoryId;
            item.Category = category;
                
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
