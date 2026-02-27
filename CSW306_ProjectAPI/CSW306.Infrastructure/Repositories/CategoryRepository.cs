using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;

namespace CSW306.Infrastructure.Repositories
{
    public class CategoryRepository : GenericRepository<Categories>, ICategoryRepository
    {
        public CategoryRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }
    }
}
