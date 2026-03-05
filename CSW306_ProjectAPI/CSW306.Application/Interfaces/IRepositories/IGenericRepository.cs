using System.Collections.Generic;

using System.Threading.Tasks;

namespace CSW306.Application.Interfaces.IRepositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<T> AddAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<IEnumerable<T>> UpdateRangeAsync(IEnumerable<T> entities);
        Task DeleteAsync(int id);
        Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize);
        Task<int> CountAsync();
    }
}
