
namespace CSW306.Application.Interfaces.IServices
{
    public interface IRedisCacheService
    {
        Task<T?> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);
        Task RemoveAsync(string key);
    
        // For Write-Back Inventory
        Task<long> DecrementAsync(string key, long value);
        Task SetAddAsync(string key, string value);
        Task<IEnumerable<string>> SetMembersAsync(string key);
        Task SetRemoveAsync(string key, string value);
    }
}
