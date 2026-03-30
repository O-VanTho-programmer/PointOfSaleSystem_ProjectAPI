using CSW306.Application.Interfaces.IServices;
using System.Threading.Tasks;

namespace CSW306.Application.Utils
{
    public static class OrderCacheHelper
    {
        public static async Task InvalidateOrderCacheAsync(IRedisCacheService redisCacheService, int orderId)
        {
            try
            {
                var keys = await redisCacheService.SetMembersAsync("orders:cachedKeys");
                if (keys != null)
                {
                    foreach (var k in keys)
                    {
                        await redisCacheService.RemoveAsync(k);
                        await redisCacheService.SetRemoveAsync("orders:cachedKeys", k);
                    }
                }
                await redisCacheService.RemoveAsync($"order:{orderId}");
            }
            catch { /* ignore redis errors */ }
        }
    }
}
