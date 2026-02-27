using CSW306.Application.Interfaces.IRepositories;
using CSW306.Domain.Entities;
using CSW306.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CSW306.Infrastructure.Repositories
{
    public class ItemRepository : GenericRepository<Items>, IItemRepository
    {
        public ItemRepository(CSW306_ProjectAPIContext context) : base(context)
        {
        }

        public async Task<Items> GetByName(string name)
        {
            var item = await _context.Items.FirstOrDefaultAsync(i => i.Name.ToLower().Equals(name.ToLower()));
            return item;
        }
    }
}
