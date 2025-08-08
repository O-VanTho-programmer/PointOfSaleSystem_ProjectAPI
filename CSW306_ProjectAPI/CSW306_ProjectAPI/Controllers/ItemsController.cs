using CSW306_ProjectAPI.DTO.Upload;
using CSW306_ProjectAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly CSW306_ProjectAPIContext _context;

        public ItemsController(CSW306_ProjectAPIContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Items>> Get() { 
            return _context.Items.ToList();
        }

        [HttpPost]
        public ActionResult Post([FromForm] ItemsUploadDTO dto)
        {
            var item = _context.Items.FirstOrDefault(i => i.Name.ToLower().Equals(dto.Name.ToLower()));
            
            if (item != null) {
                return BadRequest("Item's name has already used");
            }

            var category = _context.Categories.FirstOrDefault(c => c.CategoryId == dto.CategoryId);

            if (category == null) { 
                return NotFound("Selected Category not found");
            }

            var newItem = new Items
            {
                Name = dto.Name,
                QuantityInStock = dto.QuantityInStock,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                Category = category
            };

            _context.Items.Add(newItem);
            _context.SaveChanges();

            return Ok(newItem);
        }
    }
}
