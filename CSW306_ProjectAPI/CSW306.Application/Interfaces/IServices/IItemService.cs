using CSW306.Application.DTO.Upload;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IServices
{
    public interface IItemService
    {
        Task<TemplateApi<Items>> GetItemsAsync(int pageNumber, int pageSize);
        Task<TemplateApi<Items>> GetItemAsync(int id);
        Task<TemplateApi<Items>> CreateItemAsync(ItemsUploadDTO uploadDTO);
        Task<TemplateApi<Items>> UpdateItemAsync(int id, ItemsUploadDTO uploadDTO);
    }
}
