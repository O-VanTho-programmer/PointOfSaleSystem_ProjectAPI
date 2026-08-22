using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IExternal;
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
        private readonly IPhotoService _photoService;
        private readonly ICurrentUserProvider _currentUserProvider;

        public ItemService(IUnitOfWork unitOfWork, IRedisCacheService redisCacheService, IPhotoService photoService, ICurrentUserProvider currentUserProvider)
        {
            _unitOfWork = unitOfWork;
            _redisCacheService = redisCacheService;
            _photoService = photoService;
            _currentUserProvider = currentUserProvider;
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
            };

            if (uploadDTO.ImageStream != null)
            {
                var fileName = uploadDTO.ImageName ?? Guid.NewGuid().ToString();
                (string imageUrl, string imagePublicId) = await _photoService.AddPhotoAsync(uploadDTO.ImageStream, fileName);

                newItem.ImageUrl = imageUrl;
                newItem.ImagePublicId = imagePublicId;
            }

            await _unitOfWork.Items.AddAsync(newItem);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("items");
            await _redisCacheService.SetAsync("item:" + newItem.ItemId, newItem);

            try
            {
                var performerId = _currentUserProvider?.GetCurrentUserId();
                Users? performer = null;
                if (performerId.HasValue)
                {
                    performer = await _unitOfWork.Users.GetByIdAsync(performerId.Value);
                }

                var performerDescriptor = performer != null
                    ? $"{performer.Role ?? "User"} {performer.Name} (#{performer.UserId})"
                    : (performerId.HasValue ? $"User #{performerId.Value}" : "Anonymous");

                var details = $"{performerDescriptor} created item '{newItem.Name}' (Id: {newItem.ItemId}) in category '{category.Name}' with price {newItem.Price:C}.";

                await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                {
                    Action = "CreateItem",
                    EntityName = "Item",
                    EntityId = newItem.ItemId,
                    UserId = performerId ?? 0,
                    Details = details,
                    Timestamp = DateTimeOffset.UtcNow
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch { /* ignore logging failures */ }

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

        //public async Task<TemplateApi<Items>> GetItemsByFilter()
        //{

        //}

        public async Task<TemplateApi<Items>> GetItemsAsync(int? pageNumber, int? pageSize)
        {   
            var cachedItems = await _redisCacheService.GetAsync<IEnumerable<Items>>("items");

            if(cachedItems == null){
                cachedItems = await _unitOfWork.Items.GetAllAsync();
                await _redisCacheService.SetAsync("items", cachedItems);
            }

            var totalCount = cachedItems.Count();
           
            var pagination = new Pagination();
            return pagination.HandleGetAllRespond(pageNumber ?? 1, pageSize ?? totalCount, cachedItems.ToList(), totalCount);
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

            var oldName = item.Name;
            var oldPrice = item.Price;
            var oldIsSoldOut = item.IsSoldOut;
            var oldCategory = await _unitOfWork.Categories.GetByIdAsync(item.CategoryId);

            item.Name = uploadDTO.Name;
            item.CategoryId = uploadDTO.CategoryId;
            item.Category = category;
            item.Price = uploadDTO.Price;
            item.IsSoldOut = uploadDTO.IsSoldOut;

            if (uploadDTO.ImageStream != null) { 
                if (item.ImagePublicId != null) {
                    await _photoService.DeletePhotoAsync(item.ImagePublicId);
                }

                var fileName = uploadDTO.ImageName ?? Guid.NewGuid().ToString();
                (string imageUrl, string imagePublicId) = await _photoService.AddPhotoAsync(uploadDTO.ImageStream, fileName);

                item.ImageUrl = imageUrl;
                item.ImagePublicId = imagePublicId;
            }

            await _unitOfWork.Items.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();

            await _redisCacheService.RemoveAsync("items");
            await _redisCacheService.SetAsync("item:" + id, item);

            try
            {
                var performerId = _currentUserProvider?.GetCurrentUserId();
                Users? performer = null;
                if (performerId.HasValue)
                {
                    performer = await _unitOfWork.Users.GetByIdAsync(performerId.Value);
                }

                var performerDescriptor = performer != null
                    ? $"{performer.Role ?? "User"} {performer.Name} (#{performer.UserId})"
                    : (performerId.HasValue ? $"User #{performerId.Value}" : "Anonymous");

                var details = $"{performerDescriptor} updated item (Id: {item.ItemId}). Name: '{oldName}' => '{item.Name}'; Price: {oldPrice:C} => {item.Price:C}; SoldOut: {oldIsSoldOut} => {item.IsSoldOut}; Category: '{oldCategory?.Name ?? oldCategory?.CategoryId.ToString()}' => '{category.Name}'.";

                await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                {
                    Action = "UpdateItem",
                    EntityName = "Item",
                    EntityId = item.ItemId,
                    UserId = performerId ?? 0,
                    Details = details,
                    Timestamp = DateTimeOffset.UtcNow
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch { /* ignore logging failures */ }

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

            try
            {
                var performerId = _currentUserProvider?.GetCurrentUserId();
                Users? performer = null;
                if (performerId.HasValue)
                {
                    performer = await _unitOfWork.Users.GetByIdAsync(performerId.Value);
                }

                var performerDescriptor = performer != null
                    ? $"{performer.Role ?? "User"} {performer.Name} (#{performer.UserId})"
                    : (performerId.HasValue ? $"User #{performerId.Value}" : "Anonymous");

                var details = $"{performerDescriptor} deleted item '{item.Name}' (Id: {item.ItemId}) from category '{item.Category?.Name ?? item.CategoryId.ToString()}' with price {item.Price:C}.";

                await _unitOfWork.ActivityLogs.AddAsync(new ActivityLog
                {
                    Action = "DeleteItem",
                    EntityName = "Item",
                    EntityId = item.ItemId,
                    UserId = performerId ?? 0,
                    Details = details,
                    Timestamp = DateTimeOffset.UtcNow
                });

                await _unitOfWork.SaveChangesAsync();
            }
            catch { /* ignore logging failures */ }

            return new TemplateApi<Items>(item, null, "Item deleted successfully", true, 0, 0, 0, 0);
        }
    }   
}
