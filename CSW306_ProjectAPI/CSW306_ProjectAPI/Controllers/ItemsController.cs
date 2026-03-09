using CSW306.Application.DTO.Upload;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CSW306.Application.Services;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;

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
        public async Task<ActionResult<TemplateApi<Items>>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10) { 
            var result = await _itemService.GetItemsAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateApi<Items>>> GetById(int id) { 
            var result = await _itemService.GetItemAsync(id);

            if (!result.Success) { 
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> CreateItem([FromBody] ItemsUploadDTO dto)
        {
            var item = await _itemService.CreateItemAsync(dto);
            
            if (!item.Success) {
                return BadRequest(item);
            }

            return Ok(item);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager,Chef")]
        public async Task<ActionResult> UpdateItem(int id, [FromBody] ItemsUploadDTO uploadDTO)
        {
            var item = await _itemService.UpdateItemAsync(id, uploadDTO);
            
            if (!item.Success) {
                return BadRequest(item);
            }

            return Ok(item);
        }
    }
}
