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
         
        public ItemService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
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
                QuantityInStock = uploadDTO.QuantityInStock,
            };

            await _unitOfWork.Items.AddAsync(newItem);
            await _unitOfWork.SaveChangesAsync();

            return new TemplateApi<Items>(newItem, null, "Item created successfully", true, 0, 0, 0, 0);
        }

        public async Task<TemplateApi<Items>> GetItemAsync(int id)
        {
            var item = await _unitOfWork.Items.GetByIdAsync(id);
            var pagination = new Pagination();
            return pagination.HandleGetByIdRespond(item);
        }

        public async Task<TemplateApi<Items>> GetItemsAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _unitOfWork.Items.CountAsync();
            var items = await _unitOfWork.Items.GetPagedAsync(pageNumber, pageSize);
            var pagination = new Pagination();
            return pagination.HandlePagedRespond(pageNumber, pageSize, items, totalCount);
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
            item.QuantityInStock = uploadDTO.QuantityInStock;

            await _unitOfWork.Items.UpdateAsync(item);
            await _unitOfWork.SaveChangesAsync();
            return new TemplateApi<Items>(item, null, "Item updated successfully", true, 0, 0, 0, 0);
        }
    }
}
