using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using CSW306.Presentation.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CSW306_ProjectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<ActionResult<TemplateApi<Items>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _itemService.GetItemsAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Items>>> GetById(int id)
        {
            var result = await _itemService.GetItemAsync(id);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> CreateItem([FromForm] CreateItemRequest request)
        {
            var dto = new ItemsUploadDTO
            {
                Name = request.Name,
                IsSoldOut = request.IsSoldOut,
                Price = request.Price,
                CategoryId = request.CategoryId
            };

            if (request.Image != null)
            {
                var extension = Path.GetExtension(request.Image.FileName);
                var safeUniqueFileName = $"{Guid.NewGuid()}{extension}";

                dto.ImageName = safeUniqueFileName;
                dto.ImageStream = request.Image.OpenReadStream();
            }

            var item = await _itemService.CreateItemAsync(dto);

            if (!item.Success)
            {
                return BadRequest(item);
            }

            return Ok(item);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Chef,Cashier")]
        public async Task<ActionResult> UpdateItem(int id, [FromForm] CreateItemRequest request)
        {
            var dto = new ItemsUploadDTO
            {
                Name = request.Name,
                IsSoldOut = request.IsSoldOut,
                Price = request.Price,
                CategoryId = request.CategoryId
            };

            if (request.Image != null)
            {
                var extension = Path.GetExtension(request.Image.FileName);
                var safeUniqueFileName = $"{Guid.NewGuid()}{extension}";

                dto.ImageName = safeUniqueFileName;
                dto.ImageStream = request.Image.OpenReadStream();
            }

            var item = await _itemService.UpdateItemAsync(id, dto);

            if (!item.Success)
            {
                return BadRequest(item);
            }

            return Ok(item);
        }
    }
}
