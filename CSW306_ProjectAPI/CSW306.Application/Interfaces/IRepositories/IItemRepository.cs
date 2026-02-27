using CSW306.Domain.Entities;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IItemRepository : IGenericRepository<Items>
    {
        Task<Items> GetByName(string name);
    }
}
