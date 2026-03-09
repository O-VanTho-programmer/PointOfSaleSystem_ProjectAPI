using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRedisCacheService _redisCacheService;
        private readonly IAuditLogService _auditLogService;

        public ItemService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService, IAuditLogService auditLogService)
        {
            this._unitOfWork = unitOfWork;
            this._redisCacheService = redisCacheService;
            this._auditLogService = auditLogService;
        }

        public async Task<TemplateApi<Items>> CreateItemAsync(ItemsUploadDTO uploadDTO)
        {
            var exist = await _unitOfWork.Items.GetByName(uploadDTO.Name);

            if (exist != null) {
                return new TemplateApi<Items>(null, null, "Item already exists", false, 0, 0, 0, 0);
            }

            var category = await _unitOfWork.Categories.GetByIdAsync(uploadDTO.CategoryId);
            if (category == null) {
                return new TemplateApi<Items>(null, null, "Category not found", false, 0, 0, 0, 0);
            }

            var newItem = new Items
            {
                Name = uploadDTO.Name,
                CategoryId = uploadDTO.CategoryId,
                Category = category,
                Price = uploadDTO.Price,
                IsSoldOut = uploadDTO.IsSoldOut,
                ImageUrl = uploadDTO.ImageUrl,
            };

            await _unitOfWork.Items.AddAsync(newItem);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("items");
            await _redisCacheService.SetAsync("item:" + newItem.ItemId, newItem);

            _auditLogService.EnqueueLog("CreateItem", "Items", newItem.ItemId, null, $"Name: {newItem.Name}, Price: {newItem.Price}");

            return new TemplateApi<Items>(newItem, null, "Item created successfully", true, 0, 0, 0, 0);
        }

        public async Task<TemplateApi<Items>> GetItemAsync(int id)
        {

            var cachedItems = await _redisCacheService.GetAsync<Items>("item:" + id);
            if(cachedItems != null){
                return new TemplateApi<Items>(cachedItems, null, "Item found in cache", true, 0, 0, 0, 0);
            }

            var item = await _unitOfWork.Items.GetByIdAsync(id);

            if(item != null){   
                await _redisCacheService.SetAsync("item:" + id, item);
            }

            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(item);
        }

        public async Task<TemplateApi<Items>> GetItemsAsync(int pageNumber, int pageSize)
        {   
            var cachedItems = await _redisCacheService.GetAsync<IEnumerable<Items>>("items");

            if(cachedItems == null){
                cachedItems = await _unitOfWork.Items.GetAllAsync();
                await _redisCacheService.SetAsync("items", cachedItems);
            }

            var totalCount = cachedItems.Count();
            var pagedItems = cachedItems.Skip((pageNumber - 1) * pageSize).Take(pageSize);
           

            var pagination = new Pagination();
            return pagination.HandlePagedRespond(pageNumber, pageSize, pagedItems.ToList(), totalCount);
        }

        public async Task<TemplateApi<Items>> UpdateItemAsync(int id, ItemsUploadDTO uploadDTO)
        {
            var item = await _unitOfWork.Items.GetByIdAsync(id);
            if (item == null) {
                return new TemplateApi<Items>(null, null, "Item not found", false, 0, 0, 0, 0);
            }

            var category = await _unitOfWork.Categories.GetByIdAsync(uploadDTO.CategoryId);
            if (category == null) {
                return new TemplateApi<Items>(null, null, "Category not found", false, 0, 0, 0, 0);
            }

            item.Name = uploadDTO.Name;
            item.CategoryId = uploadDTO.CategoryId;
            item.Category = category;
            item.Price = uploadDTO.Price;
            item.IsSoldOut = uploadDTO.IsSoldOut;
            item.ImageUrl = uploadDTO.ImageUrl;

            await _unitOfWork.Items.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("items");
            await _redisCacheService.SetAsync("item:" + id, item);

            _auditLogService.EnqueueLog("UpdateItem", "Items", id, null, $"Name: {item.Name}, IsSoldOut: {item.IsSoldOut}");

            return new TemplateApi<Items>(item, null, "Item updated successfully", true, 0, 0, 0, 0);
        }

        public async Task<TemplateApi<Items>> DeleteItemAsync(int id)
        {
            var item = await _unitOfWork.Items.GetByIdAsync(id);
            if (item == null) {
                return new TemplateApi<Items>(null, null, "Item not found", false, 0, 0, 0, 0);
            }

            await _unitOfWork.Items.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("items");
            await _redisCacheService.RemoveAsync("item:" + id);

            _auditLogService.EnqueueLog("DeleteItem", "Items", id, null, $"Deleted: {item.Name}");

            return new TemplateApi<Items>(item, null, "Item deleted successfully", true, 0, 0, 0, 0);
        }
    }   
}
